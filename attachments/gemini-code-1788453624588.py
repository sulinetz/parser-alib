import customtkinter as ctk
import tkinter.messagebox as mb
import ctypes
from ctypes import wintypes
import html
import re
from bs4 import BeautifulSoup
import webbrowser
import json
import os
import time
import requests

DB_FILE = "alib_orders.json"
CONFIG_FILE = "alib_config.json"

# ---- Нативный механизм буфера обмена Windows (HTML Format для Outlook) ------
def _build_cf_html(fragment: str) -> bytes:
    prefix = (
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">\r\n"
        "<html>\r\n<body>\r\n<!--StartFragment-->"
    )
    suffix = "<!--EndFragment-->\r\n</body>\r\n</html>"

    prefix_bytes = prefix.encode("utf-8")
    fragment_bytes = fragment.encode("utf-8")
    suffix_bytes = suffix.encode("utf-8")

    header_template = (
        "Version:0.9\r\n"
        "StartHTML:{:08d}\r\n"
        "EndHTML:{:08d}\r\n"
        "StartFragment:{:08d}\r\n"
        "EndFragment:{:08d}\r\n"
    )
    dummy_header = header_template.format(0, 0, 0, 0)
    header_len = len(dummy_header.encode("ascii"))

    start_html = header_len
    start_fragment = start_html + len(prefix_bytes)
    end_fragment = start_fragment + len(fragment_bytes)
    end_html = end_fragment + len(suffix_bytes)

    header = header_template.format(
        start_html, end_html, start_fragment, end_fragment
    ).encode("ascii")

    return header + prefix_bytes + fragment_bytes + suffix_bytes


def copy_rich_html_to_clipboard(plain_text: str, html_fragment: str) -> bool:
    if os.name != "nt":
        return False

    user32 = ctypes.windll.user32
    kernel32 = ctypes.windll.kernel32

    user32.OpenClipboard.argtypes = [wintypes.HWND]
    user32.OpenClipboard.restype = wintypes.BOOL
    user32.CloseClipboard.argtypes = []
    user32.CloseClipboard.restype = wintypes.BOOL
    user32.EmptyClipboard.argtypes = []
    user32.EmptyClipboard.restype = wintypes.BOOL
    user32.SetClipboardData.argtypes = [wintypes.UINT, wintypes.HANDLE]
    user32.SetClipboardData.restype = wintypes.HANDLE
    user32.RegisterClipboardFormatW.argtypes = [wintypes.LPCWSTR]
    user32.RegisterClipboardFormatW.restype = wintypes.UINT

    kernel32.GlobalAlloc.argtypes = [wintypes.UINT, ctypes.c_size_t]
    kernel32.GlobalAlloc.restype = wintypes.HGLOBAL
    kernel32.GlobalLock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalLock.restype = ctypes.c_void_p
    kernel32.GlobalUnlock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalUnlock.restype = wintypes.BOOL
    kernel32.GlobalFree.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalFree.restype = wintypes.HGLOBAL

    CF_UNICODETEXT = 13
    GHND = 0x0042

    opened = False
    for _ in range(10):
        if user32.OpenClipboard(None):
            opened = True
            break
        time.sleep(0.03)

    if not opened:
        return False

    try:
        user32.EmptyClipboard()

        text_bytes = (plain_text + "\0").encode("utf-16le")
        h_text = kernel32.GlobalAlloc(GHND, len(text_bytes))
        if h_text:
            p_text = kernel32.GlobalLock(h_text)
            if p_text:
                ctypes.memmove(p_text, text_bytes, len(text_bytes))
                kernel32.GlobalUnlock(h_text)
                user32.SetClipboardData(CF_UNICODETEXT, h_text)
            else:
                kernel32.GlobalFree(h_text)

        if html_fragment:
            cf_html = user32.RegisterClipboardFormatW("HTML Format")
            if cf_html:
                html_bytes = _build_cf_html(html_fragment) + b"\0"
                h_html = kernel32.GlobalAlloc(GHND, len(html_bytes))
                if h_html:
                    p_html = kernel32.GlobalLock(h_html)
                    if p_html:
                        ctypes.memmove(p_html, html_bytes, len(html_bytes))
                        kernel32.GlobalUnlock(h_html)
                        user32.SetClipboardData(cf_html, h_html)
                    else:
                        kernel32.GlobalFree(h_html)
        return True
    finally:
        user32.CloseClipboard()


# ---- Визуальная система -----------------------------------------------------
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("dark-blue")

COLORS = {
    "bg": "#0B1120",
    "panel": "#111827",
    "panel_2": "#172033",
    "card": "#1B263B",
    "card_hover": "#22314A",
    "border": "#2B3954",
    "text": "#F8FAFC",
    "muted": "#94A3B8",
    "accent": "#3B82F6",
    "accent_hover": "#2563EB",
    "success": "#16A34A",
    "success_hover": "#15803D",
    "warning": "#D97706",
    "warning_hover": "#B45309",
    "danger": "#DC2626",
    "danger_hover": "#B91C1C",
    "history": "#475569",
    "history_hover": "#334155",
}


class AlibOrderManager(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Alib — Менеджер заказов")
        self.geometry("1400x880")
        self.minsize(1120, 700)
        self.configure(fg_color=COLORS["bg"])

        self.db = self.load_db()
        self.config = self.load_config()
        self.current_user_email = None
        self.export_vars = {}

        self.grid_columnconfigure(0, weight=0, minsize=410)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(2, weight=1)

        self._build_header()
        self._build_import_panel()
        self._build_sidebar()
        self._build_content()

        self.refresh_users_list()

    # ---- Построение интерфейса ---------------------------------------------
    def _build_header(self):
        header = ctk.CTkFrame(
            self, fg_color=COLORS["panel"], corner_radius=18,
            border_width=1, border_color=COLORS["border"], height=76
        )
        header.grid(row=0, column=0, columnspan=2, padx=14, pady=(14, 8), sticky="ew")
        header.grid_propagate(False)
        header.grid_columnconfigure(1, weight=1)

        brand = ctk.CTkFrame(header, fg_color="transparent")
        brand.grid(row=0, column=0, padx=22, pady=12, sticky="w")

        ctk.CTkLabel(
            brand, text="ALIB", font=("Segoe UI", 22, "bold"),
            text_color=COLORS["accent"]
        ).pack(anchor="w")
        ctk.CTkLabel(
            brand, text="МЕНЕДЖЕР ЗАКАЗОВ", font=("Segoe UI", 10, "bold"),
            text_color=COLORS["muted"]
        ).pack(anchor="w", pady=(0, 1))

        self.lbl_stats = ctk.CTkLabel(
            header, text="", font=("Segoe UI", 12),
            text_color=COLORS["muted"]
        )
        self.lbl_stats.grid(row=0, column=1, padx=20, sticky="e")

        ctk.CTkLabel(
            header, text="Рабочая панель", font=("Segoe UI", 15, "bold"),
            text_color=COLORS["text"]
        ).grid(row=0, column=2, padx=22, sticky="e")

    def _build_import_panel(self):
        panel = ctk.CTkFrame(
            self, fg_color=COLORS["panel"], corner_radius=18,
            border_width=1, border_color=COLORS["border"]
        )
        panel.grid(row=1, column=0, columnspan=2, padx=14, pady=(0, 8), sticky="ew")
        panel.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(
            panel, text="Импорт заказов", font=("Segoe UI", 15, "bold"),
            text_color=COLORS["text"]
        ).grid(row=0, column=0, padx=(18, 12), pady=(14, 6), sticky="w")

        ctk.CTkLabel(
            panel, text="Ссылка на страницу заказов", font=("Segoe UI", 11),
            text_color=COLORS["muted"]
        ).grid(row=0, column=1, padx=8, pady=(14, 6), sticky="w")

        self.entry_url = ctk.CTkEntry(
            panel,
            placeholder_text="Вставьте ссылку на страницу заказов Alib.ru...",
            height=38,
            border_color=COLORS["border"],
            fg_color=COLORS["bg"],
        )
        self.entry_url.grid(row=1, column=1, padx=8, pady=(0, 14), sticky="ew")
        if self.config.get("url"):
            self.entry_url.insert(0, self.config["url"])

        self.btn_fetch = ctk.CTkButton(
            panel, text="↓ Загрузить", command=self.fetch_from_web,
            width=150, height=38,
            fg_color=COLORS["success"], hover_color=COLORS["success_hover"],
            font=("Segoe UI", 12, "bold")
        )
        self.btn_fetch.grid(row=1, column=2, padx=(8, 18), pady=(0, 14))

        ctk.CTkLabel(
            panel, text="HTML вручную", font=("Segoe UI", 11),
            text_color=COLORS["muted"]
        ).grid(row=2, column=0, padx=(18, 12), pady=(4, 4), sticky="w")

        self.textbox_html = ctk.CTkTextbox(
            panel, height=68, wrap="none",
            border_width=1, border_color=COLORS["border"],
            fg_color=COLORS["bg"], corner_radius=10
        )
        self.textbox_html.grid(row=2, column=1, padx=8, pady=(4, 14), sticky="ew")

        self.btn_parse = ctk.CTkButton(
            panel, text="Распарсить", command=lambda: self.process_html(),
            width=150, height=38,
            fg_color=COLORS["accent"], hover_color=COLORS["accent_hover"],
            font=("Segoe UI", 12, "bold")
        )
        self.btn_parse.grid(row=2, column=2, padx=(8, 18), pady=(4, 14))

    def _build_sidebar(self):
        self.frame_left = ctk.CTkFrame(
            self, fg_color=COLORS["panel"], corner_radius=18,
            border_width=1, border_color=COLORS["border"]
        )
        self.frame_left.grid(row=2, column=0, padx=(14, 7), pady=(0, 14), sticky="nsew")
        self.frame_left.grid_columnconfigure(0, weight=1)
        self.frame_left.grid_rowconfigure(2, weight=1)

        ctk.CTkLabel(
            self.frame_left, text="Покупатели", font=("Segoe UI", 17, "bold"),
            text_color=COLORS["text"]
        ).grid(row=0, column=0, padx=16, pady=16, sticky="w")

        self.btn_mass_export = ctk.CTkButton(
            self.frame_left, text="📦  Экспорт выбранных в буфер",
            fg_color=COLORS["warning"], hover_color=COLORS["warning_hover"],
            command=self.mass_export, height=40,
            font=("Segoe UI", 12, "bold")
        )
        self.btn_mass_export.grid(row=1, column=0, padx=12, pady=(4, 10), sticky="ew")

        self.tabview = ctk.CTkTabview(
            self.frame_left,
            fg_color=COLORS["bg"],
            segmented_button_fg_color=COLORS["panel_2"],
            segmented_button_selected_color=COLORS["accent"],
            segmented_button_selected_hover_color=COLORS["accent_hover"],
            segmented_button_unselected_color=COLORS["panel_2"],
            segmented_button_unselected_hover_color=COLORS["card"],
        )
        self.tabview.grid(row=2, column=0, padx=12, pady=(0, 12), sticky="nsew")
        self.tabview.add("В работе")
        self.tabview.add("История")

        for name in ("В работе", "История"):
            tab = self.tabview.tab(name)
            tab.configure(fg_color=COLORS["bg"])
            tab.grid_columnconfigure(0, weight=1)
            tab.grid_rowconfigure(0, weight=1)

        self.scroll_active = ctk.CTkScrollableFrame(
            self.tabview.tab("В работе"), fg_color="transparent"
        )
        self.scroll_active.grid(row=0, column=0, sticky="nsew")

        self.scroll_history = ctk.CTkScrollableFrame(
            self.tabview.tab("История"), fg_color="transparent"
        )
        self.scroll_history.grid(row=0, column=0, sticky="nsew")

    def _build_content(self):
        self.frame_books_container = ctk.CTkFrame(
            self, fg_color=COLORS["panel"], corner_radius=18,
            border_width=1, border_color=COLORS["border"]
        )
        self.frame_books_container.grid(row=2, column=1, padx=(7, 14), pady=(0, 14), sticky="nsew")
        self.frame_books_container.grid_rowconfigure(1, weight=1)
        self.frame_books_container.grid_columnconfigure(0, weight=1)

        self.frame_books_header = ctk.CTkFrame(
            self.frame_books_container, fg_color=COLORS["panel_2"], corner_radius=14
        )
        self.frame_books_header.grid(row=0, column=0, sticky="ew", padx=12, pady=12)
        self.frame_books_header.grid_columnconfigure(0, weight=1)

        info = ctk.CTkFrame(self.frame_books_header, fg_color="transparent")
        info.grid(row=0, column=0, padx=14, pady=(11, 2), sticky="ew")

        ctk.CTkLabel(
            info, text="ТЕКУЩИЙ ПОКУПАТЕЛЬ", font=("Segoe UI", 10, "bold"),
            text_color=COLORS["muted"]
        ).pack(anchor="w")

        self.lbl_user_info = ctk.CTkLabel(
            info, text="Выберите покупателя слева",
            font=("Segoe UI", 16, "bold"), text_color=COLORS["text"],
            anchor="w", justify="left"
        )
        self.lbl_user_info.pack(anchor="w", pady=(2, 0), fill="x")

        controls = ctk.CTkFrame(self.frame_books_header, fg_color="transparent")
        controls.grid(row=1, column=0, padx=14, pady=(4, 11), sticky="ew")
        controls.grid_columnconfigure(0, weight=1)

        self.weight_frame = ctk.CTkFrame(controls, fg_color="transparent")
        self.weight_frame.grid(row=0, column=0, sticky="w")

        ctk.CTkLabel(
            self.weight_frame, text="ОБЩИЙ ВЕС (г / кг)", font=("Segoe UI", 9, "bold"),
            text_color=COLORS["muted"]
        ).grid(row=0, column=0, columnspan=2, sticky="w")

        self.entry_weight = ctk.CTkEntry(
            self.weight_frame, width=120, height=32,
            placeholder_text="600 г или 1.2 кг",
            fg_color=COLORS["bg"], border_color=COLORS["border"]
        )
        self.entry_weight.grid(row=1, column=0, pady=(3, 0), padx=(0, 6))
        self.entry_weight.bind("<Return>", lambda e: self.export_to_clipboard())

        self.btn_save_weight = ctk.CTkButton(
            self.weight_frame, text="Сохранить", width=84, height=32,
            fg_color=COLORS["success"], hover_color=COLORS["success_hover"],
            command=self.save_current_weight
        )
        self.btn_save_weight.grid(row=1, column=1, pady=(3, 0))

        self.actions_frame = ctk.CTkFrame(controls, fg_color="transparent")
        self.actions_frame.grid(row=0, column=1, sticky="e")

        self.btn_delete_user = ctk.CTkButton(
            self.actions_frame, text="Удалить",
            fg_color=COLORS["danger"], hover_color=COLORS["danger_hover"],
            width=100, height=34, command=self.delete_current_user
        )
        self.btn_history = ctk.CTkButton(
            self.actions_frame, text="В историю",
            fg_color=COLORS["warning"], hover_color=COLORS["warning_hover"],
            width=110, height=34, command=self.toggle_history
        )
        self.btn_export = ctk.CTkButton(
            self.actions_frame, text="📋 Экспорт в буфер",
            fg_color=COLORS["accent"], hover_color=COLORS["accent_hover"],
            width=150, height=34, command=self.export_to_clipboard
        )
        self.btn_outlook = ctk.CTkButton(
            self.actions_frame, text="✉ Outlook",
            fg_color=COLORS["success"], hover_color=COLORS["success_hover"],
            width=100, height=34, command=self.export_to_outlook
        )

        self.frame_books = ctk.CTkScrollableFrame(
            self.frame_books_container, fg_color=COLORS["bg"], corner_radius=14
        )
        self.frame_books.grid(row=1, column=0, sticky="nsew", padx=12, pady=(0, 12))

        self.empty_state = ctk.CTkLabel(
            self.frame_books,
            text="Выберите покупателя\n\nЗдесь появятся книги и статусы сборки",
            font=("Segoe UI", 15),
            text_color=COLORS["muted"],
            justify="center"
        )
        self.empty_state.pack(expand=True, pady=120)
        self.btn_export.pack_forget()
        self.btn_outlook.pack_forget()
        self.btn_history.pack_forget()
        self.btn_delete_user.pack_forget()

    # ---- Данные -------------------------------------------------------------
    def load_db(self):
        if os.path.exists(DB_FILE):
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def save_db(self):
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(self.db, f, ensure_ascii=False, indent=4)

    def load_config(self):
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def save_config(self, url):
        self.config["url"] = url
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(self.config, f, ensure_ascii=False, indent=4)

    def _get_sortable_date(self, date_str):
        match = re.search(r'(\d{2})\.(\d{2})\.(\d{4})', date_str)
        if match:
            return f"{match.group(3)}{match.group(2)}{match.group(1)}"
        return "00000000"

    # ---- Импорт -------------------------------------------------------------
    def fetch_from_web(self):
        url = self.entry_url.get().strip()
        if not url.startswith("http"):
            mb.showerror("Ошибка", "Введите корректную ссылку на заказы.")
            return

        self.save_config(url)
        self.btn_fetch.configure(text="Загрузка...", state="disabled")
        self.update()

        try:
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            response.encoding = "windows-1251"
            self.process_html(html_content=response.text)

            self.btn_fetch.configure(text="✓ Успешно!", fg_color=COLORS["accent"])
            self.after(
                2000,
                lambda: self.btn_fetch.configure(
                    text="↓ Загрузить", state="normal", fg_color=COLORS["success"]
                )
            )
        except Exception as e:
            mb.showerror("Ошибка сети", f"Не удалось загрузить страницу:\n{e}")
            self.btn_fetch.configure(text="↓ Загрузить", state="normal")

    def process_html(self, html_content=None):
        if html_content is None:
            html_content = self.textbox_html.get("1.0", "end")
            is_manual = True
        else:
            is_manual = False

        if "<p" not in html_content.lower() and "<hr" not in html_content.lower():
            if is_manual:
                mb.showwarning("Внимание", "Вы вставили обычный текст. Нужен исходный HTML-код!")
            return

        raw_blocks = re.split(r"<hr\s*/?>", html_content, flags=re.IGNORECASE)
        parsed_count = 0

        for block in raw_blocks:
            if not block.strip() or "Конец списка" in block:
                continue

            soup = BeautifulSoup(block, "html.parser")
            paragraphs = soup.find_all("p")
            if len(paragraphs) < 3:
                continue

            p0, p1, p2 = paragraphs[0], paragraphs[1], paragraphs[2]
            p0_text = p0.get_text(" ", strip=True).replace("\n", " ").replace("\r", "")
            p2_html = str(p2).replace("\n", " ").replace("\r", "")
            p2_text = p2.get_text(" ", strip=True).replace("\n", " ").replace("\r", "")

            title_tag = p0.find("b")
            book_title = title_tag.text.strip() if title_tag else "Неизвестная книга"
            year_match = re.search(r"(\d{4})г\.", p0_text)
            year = year_match.group(1) if year_match else "Год?"

            block_text = soup.get_text(" ", strip=True).replace("\n", " ").replace("\r", "")
            price = ""
            for pattern in (
                r"Цена\s*[:\-]?\s*([\d\s]+(?:[,.]\d{1,2})?)\s*(?:руб\.?|р\.)",
                r"([\d\s]+(?:[,.]\d{1,2})?)\s*(?:руб\.?|р\.)"
            ):
                price_match = re.search(pattern, block_text, re.IGNORECASE)
                if price_match:
                    price = " ".join(price_match.group(1).split()) + " ₽"
                    break

            photo_link = None
            for a_tag in soup.find_all("a"):
                a_text = a_tag.get_text(" ", strip=True).lower()
                href = a_tag.get("href")
                if href and ("фото" in a_text or "photo" in href.lower()):
                    photo_link = href if href.startswith("http") else f"https://www.alib.ru/{href.lstrip('/')}"
                    break

            code_match = re.search(r"Код книги для BS:\s*(.*)", p1.get_text(" ", strip=True))
            bs_code = code_match.group(1).strip() if code_match else f"no_code_{book_title[:10]}"

            fio_match = re.search(r"ФИО:\s*<b>(.*?)</b>", p2_html)
            fio = re.sub(r"<[^>]+>", "", fio_match.group(1)).strip() if fio_match else "Неизвестно"
            email_match = re.search(r"mail:\s*([^)\s]+)", p2_text, re.IGNORECASE)
            email = email_match.group(1).strip() if email_match else f"no_email_{fio.replace(' ', '_')}"

            address = ""
            addr_match = re.search(r"Адрес:\s*(.*?)(?:<br\s*/?>|Комментарий|ФИО)", p2_html, re.IGNORECASE)
            if addr_match:
                address = re.sub(r"<[^>]+>", "", addr_match.group(1)).strip().rstrip(",")

            date_match = re.search(r"(\d{2}\.\d{2}\.\d{4})", p2_text)
            order_date = date_match.group(1).strip() if date_match else "??"

            if email not in self.db:
                self.db[email] = {"fio": fio, "address": address, "orders": {}, "archived": False}
            else:
                if address:
                    self.db[email]["address"] = address

            if bs_code not in self.db[email]["orders"]:
                self.db[email]["orders"][bs_code] = {
                    "title": book_title,
                    "year": year,
                    "price": price,
                    "photo": photo_link,
                    "date": order_date,
                    "status": "pending"
                }
                self.db[email]["archived"] = False
                parsed_count += 1
            else:
                existing = self.db[email]["orders"][bs_code]
                if price and not existing.get("price"):
                    existing["price"] = price
                if photo_link and not existing.get("photo"):
                    existing["photo"] = photo_link

        self.save_db()
        self.refresh_users_list()

        if self.current_user_email:
            self.show_user_books(self.current_user_email)
        if is_manual:
            self.textbox_html.delete("1.0", "end")

        if parsed_count > 0:
            if is_manual:
                mb.showinfo("Результат", f"Успешно добавлено новых заказов (книг): {parsed_count}")
        else:
            if is_manual:
                mb.showinfo("Результат", "В тексте не найдено НОВЫХ заказов.")

    # ---- Списки -------------------------------------------------------------
    def _update_stats(self):
        active_users = sum(1 for x in self.db.values() if not x.get("archived", False))
        archived = len(self.db) - active_users
        books = sum(len(x.get("orders", {})) for x in self.db.values())
        self.lbl_stats.configure(
            text=f"В работе: {active_users}   •   История: {archived}   •   Книг: {books}"
        )

    def refresh_users_list(self):
        for widget in self.scroll_active.winfo_children():
            widget.destroy()
        for widget in self.scroll_history.winfo_children():
            widget.destroy()

        def get_user_sort_key(item):
            _, data = item
            latest_date = "00000000"
            for book in data.get("orders", {}).values():
                d = self._get_sortable_date(book.get("date", ""))
                if d > latest_date:
                    latest_date = d
            return latest_date

        sorted_users = sorted(self.db.items(), key=get_user_sort_key, reverse=True)

        for email, user_data in sorted_users:
            fio = user_data.get("fio", "Без имени")
            is_archived = user_data.get("archived", False)
            total_books = len(user_data.get("orders", {}))
            checked_books = sum(
                1 for b in user_data.get("orders", {}).values()
                if b.get("status", "pending") != "pending"
            )

            address = user_data.get("address", "")
            short_addr = (
                address[:38] + "…" if len(address) > 38
                else (address if address.strip() else "Адрес не указан")
            )

            weight_val = user_data.get("total_weight", "").strip()
            weight_badge = f"  •  ⚖ {weight_val}" if weight_val else ""

            target = self.scroll_history if is_archived else self.scroll_active

            card = ctk.CTkFrame(
                target,
                fg_color=COLORS["history"] if is_archived else COLORS["card"],
                corner_radius=12,
                border_width=1,
                border_color=COLORS["border"],
            )
            card.pack(pady=4, padx=2, fill="x")
            card.grid_columnconfigure(1, weight=1)

            if not is_archived:
                var = self.export_vars.setdefault(email, ctk.BooleanVar(value=False))
                chk = ctk.CTkCheckBox(
                    card, text="", variable=var, width=28,
                    checkbox_width=18, checkbox_height=18
                )
                chk.grid(row=0, column=0, rowspan=2, padx=(10, 2), pady=10)

            name_lbl = ctk.CTkLabel(
                card, text=fio, font=("Segoe UI", 13, "bold"),
                text_color=COLORS["text"], anchor="w"
            )
            name_lbl.grid(row=0, column=1, padx=(10, 10), pady=(10, 0), sticky="ew")

            progress_text = f"Проверено {checked_books}/{total_books}{weight_badge}"
            if is_archived:
                progress_text = f"📦 История  •  {total_books} книг{weight_badge}"

            meta_lbl = ctk.CTkLabel(
                card, text=f"📍 {short_addr}\n{progress_text}",
                font=("Segoe UI", 10), text_color=COLORS["muted"],
                justify="left", anchor="w"
            )
            meta_lbl.grid(row=1, column=1, padx=(10, 10), pady=(2, 10), sticky="ew")

            def open_user(_=None, e=email):
                self.show_user_books(e)

            for widget in (card, name_lbl, meta_lbl):
                widget.bind("<Button-1>", open_user)
                widget.bind("<Enter>", lambda e, c=card, a=is_archived: c.configure(
                    fg_color=COLORS["history_hover"] if a else COLORS["card_hover"]
                ))
                widget.bind("<Leave>", lambda e, c=card, a=is_archived: c.configure(
                    fg_color=COLORS["history"] if a else COLORS["card"]
                ))

        self._update_stats()

    # ---- Книги --------------------------------------------------------------
    def show_user_books(self, email):
        self.current_user_email = email
        for widget in self.frame_books.winfo_children():
            widget.destroy()

        user_data = self.db.get(email, {})
        full_address = user_data.get("address", "") or "Адрес не указан"
        is_archived = user_data.get("archived", False)

        self.lbl_user_info.configure(
            text=f"{user_data.get('fio', 'Без имени')}   ·   📍 {full_address}"
        )

        self.entry_weight.delete(0, "end")
        saved_weight = user_data.get("total_weight", "")
        if saved_weight:
            self.entry_weight.insert(0, str(saved_weight))

        self.btn_export.pack(side="right", padx=(8, 0))
        self.btn_outlook.pack(side="right", padx=(8, 0))
        self.btn_history.pack(side="right", padx=(8, 0))
        if is_archived:
            self.btn_history.configure(
                text="↩ Вернуть в работу",
                fg_color=COLORS["accent"], hover_color=COLORS["accent_hover"]
            )
            self.btn_delete_user.pack(side="right", padx=(8, 0))
        else:
            self.btn_history.configure(
                text="📦 В историю",
                fg_color=COLORS["warning"], hover_color=COLORS["warning_hover"]
            )
            self.btn_delete_user.pack_forget()

        sorted_orders = sorted(
            user_data.get("orders", {}).items(),
            key=lambda item: self._get_sortable_date(item[1].get("date", "")),
            reverse=True
        )

        if not sorted_orders:
            ctk.CTkLabel(
                self.frame_books, text="У этого покупателя пока нет книг",
                text_color=COLORS["muted"], font=("Segoe UI", 14)
            ).pack(pady=100)
            return

        for index, (bs_code, book) in enumerate(sorted_orders, 1):
            book_frame = ctk.CTkFrame(
                self.frame_books, fg_color=COLORS["card"], corner_radius=14,
                border_width=1, border_color=COLORS["border"]
            )
            book_frame.pack(pady=5, padx=5, fill="x")
            book_frame.grid_columnconfigure(1, weight=1)

            num = ctk.CTkLabel(
                book_frame, text=f"{index:02d}", width=42,
                font=("Segoe UI", 13, "bold"), text_color=COLORS["accent"]
            )
            num.grid(row=0, column=0, rowspan=2, padx=(12, 2), pady=14)

            title = ctk.CTkLabel(
                book_frame, text=book.get("title", "?"),
                font=("Segoe UI", 14, "bold"), text_color=COLORS["text"],
                justify="left", anchor="w", wraplength=560
            )
            title.grid(row=0, column=1, padx=8, pady=(12, 1), sticky="ew")

            details = ctk.CTkLabel(
                book_frame,
                text=(
                    f"{book.get('year', '?')} год   •   "
                    f"Цена: {book.get('price') or 'не указана'}   •   "
                    f"заказ от {book.get('date', '?')}\n"
                    f"Код BS: {bs_code}"
                ),
                font=("Segoe UI", 11), text_color=COLORS["muted"], anchor="w",
                justify="left"
            )
            details.grid(row=1, column=1, padx=8, pady=(0, 12), sticky="ew")

            # 4 статуса книги
            seg_btn = ctk.CTkSegmentedButton(
                book_frame,
                values=["⏳ Ожидает", "✓ Найдено", "✕ Не найдено", "⛔ Продано"],
                command=lambda val, b=bs_code: self.update_book_status(b, val),
                fg_color=COLORS["panel_2"],
                selected_color=COLORS["accent"],
                selected_hover_color=COLORS["accent_hover"],
                unselected_color=COLORS["panel_2"],
                unselected_hover_color=COLORS["border"],
                height=32
            )

            current_status = book.get("status", "pending")
            if current_status == "found":
                seg_btn.set("✓ Найдено")
            elif current_status == "not_found":
                seg_btn.set("✕ Не найдено")
            elif current_status == "sold":
                seg_btn.set("⛔ Продано")
            else:
                seg_btn.set("⏳ Ожидает")

            seg_btn.grid(row=0, column=2, rowspan=2, padx=10, pady=12)

            btn_copy_title = ctk.CTkButton(
                book_frame, text="🔎 В поиск", width=95, height=32,
                fg_color=COLORS["panel_2"], hover_color=COLORS["border"],
                command=lambda title=book.get("title", "?"): self.copy_book_title(title)
            )
            btn_copy_title.grid(row=0, column=3, padx=(0, 8), pady=(12, 3))

            if book.get("photo"):
                btn_photo = ctk.CTkButton(
                    book_frame, text="📷 Фото", width=95, height=32,
                    fg_color=COLORS["panel_2"], hover_color=COLORS["border"],
                    command=lambda link=book["photo"]: webbrowser.open(link)
                )
                btn_photo.grid(row=1, column=3, padx=(0, 8), pady=(3, 12))

    def copy_book_title(self, title):
        self.clipboard_clear()
        self.clipboard_append(title)
        self.update()

    def save_current_weight(self):
        if not self.current_user_email:
            return

        raw = self.entry_weight.get().strip()
        if not raw:
            self.db[self.current_user_email].pop("total_weight", None)
        else:
            self.db[self.current_user_email]["total_weight"] = raw

        self.save_db()
        self.refresh_users_list()
        self.btn_save_weight.configure(text="✓ Сохранено")
        self.after(1200, lambda: self.btn_save_weight.configure(text="Сохранить"))

    def update_book_status(self, bs_code, ui_value):
        if not self.current_user_email:
            return

        status_map = {
            "⏳ Ожидает": "pending",
            "✓ Найдено": "found",
            "✕ Не найдено": "not_found",
            "⛔ Продано": "sold"
        }
        self.db[self.current_user_email]["orders"][bs_code]["status"] = status_map[ui_value]
        self.save_db()
        self.refresh_users_list()

    # ---- Экспорт ------------------------------------------------------------
    def _get_sorted_orders(self, email):
        user_data = self.db.get(email, {})
        return sorted(
            user_data.get("orders", {}).items(),
            key=lambda item: self._get_sortable_date(item[1].get("date", "")),
            reverse=True
        )

    def get_export_text_for_user(self, email):
        user_data = self.db.get(email, {})
        fio = user_data.get("fio", "Неизвестно")
        address = user_data.get("address", "") or "Адрес не указан"
        total_weight = user_data.get("total_weight", "")

        lines = [f"Покупатель: {fio}", f"Адрес: {address}"]
        if total_weight:
            display_weight = f"{total_weight} г" if total_weight.isdigit() else total_weight
            lines.append(f"Общий вес: {display_weight}")
        lines.append("------------------------------")

        status_text_map = {
            "found": "✅ НАЙДЕНО",
            "not_found": "❌ НЕ НАЙДЕНО",
            "sold": "⛔ ПРОДАНО",
            "pending": "⏳ ОЖИДАЕТ СБОРКИ"
        }

        for idx, (_, book) in enumerate(self._get_sorted_orders(email), 1):
            status = book.get("status", "pending")
            status_text = status_text_map.get(status, "⏳ ОЖИДАЕТ СБОРКИ")
            price = book.get("price") or "цена не указана"
            photo_str = f" (фото: {book['photo']})" if book.get("photo") else ""
            lines.append(f"{idx}. {book.get('title', '?')} — {price}{photo_str} [{status_text}]")
        return "\n".join(lines)

    def get_export_html_for_user(self, email):
        user_data = self.db.get(email, {})
        fio = html.escape(str(user_data.get("fio", "Неизвестно")))
        address = html.escape(str(user_data.get("address", "") or "Адрес не указан"))
        total_weight = str(user_data.get("total_weight", "")).strip()

        rows = [
            '<div style="font-family:Segoe UI,Calibri,Arial,sans-serif;color:#222222;font-size:11pt;line-height:1.45;margin-bottom:18px;">',
            f'<div style="font-size:15pt;font-weight:bold;color:#0f172a;margin-bottom:4px;">Покупатель: <b>{fio}</b></div>',
            f'<div style="font-size:11pt;color:#334155;margin-bottom:6px;">📍 <b>Адрес:</b> {address}</div>',
        ]

        if total_weight:
            display_weight = f"{total_weight} г" if total_weight.isdigit() else total_weight
            rows.append(
                f'<div style="font-size:11pt;font-weight:bold;margin-bottom:8px;">'
                f'⚖ <b>Общий вес:</b> {html.escape(display_weight)}</div>'
            )

        rows.extend([
            '<div style="border-top:2px solid #94a3b8;width:320px;margin:10px 0 12px 0;"></div>',
            '<ol style="margin:0;padding-left:24px;">'
        ])

        for _, book in self._get_sorted_orders(email):
            title = html.escape(str(book.get("title", "?")))
            price = html.escape(str(book.get("price") or "цена не указана"))
            status = book.get("status", "pending")

            # WordMail/Outlook не сбрасывает цвет в теге <font>
            if status == "found":
                status_html = '<font color="#15803d"><b>[✓ НАЙДЕНО]</b></font>'
            elif status == "not_found":
                status_html = '<font color="#b91c1c"><b>[✕ НЕ НАЙДЕНО]</b></font>'
            elif status == "sold":
                status_html = '<font color="#7c3aed"><b>[⛔ ПРОДАНО]</b></font>'
            else:
                status_html = '<font color="#b45309"><b>[⏳ ОЖИДАЕТ СБОРКИ]</b></font>'

            # Кнопка «фото»: микро-плашка, сохраняющая фон в буфере обмена Outlook
            photo_html = ""
            if book.get("photo"):
                safe_url = html.escape(str(book["photo"]), quote=True)
                photo_html = (
                    f'&nbsp;&nbsp;<span style="mso-text-raise:1pt;">'
                    f'<a href="{safe_url}" target="_blank" '
                    f'style="background:#2563eb;background-color:#2563eb;color:#ffffff;'
                    f'font-family:Segoe UI,sans-serif;font-size:9pt;font-weight:bold;'
                    f'text-decoration:none;padding:1px 6px;border-radius:3px;'
                    f'border:1px solid #1d4ed8;">'
                    f'<font color="#ffffff"><b>фото</b></font></a></span>'
                )

            rows.append(
                f'<li style="margin:6px 0;line-height:1.4;">'
                f'{title} — <b>{price}</b> {status_html}{photo_html}</li>'
            )
        rows += ['</ol>', '</div>']
        return ''.join(rows)

    def export_to_clipboard(self):
        if not self.current_user_email:
            mb.showwarning("Экспорт", "Сначала выберите покупателя.")
            return

        if self.entry_weight.get().strip():
            self.save_current_weight()

        plain_text = self.get_export_text_for_user(self.current_user_email)
        html_fragment = self.get_export_html_for_user(self.current_user_email)

        success = copy_rich_html_to_clipboard(plain_text, html_fragment)
        if not success:
            self.clipboard_clear()
            self.clipboard_append(plain_text)
            self.update()

        original_text = self.btn_export.cget("text")
        self.btn_export.configure(text="✓ Скопировано")
        self.after(1400, lambda: self.btn_export.configure(text=original_text))

    def mass_export(self):
        if self.entry_weight.get().strip():
            self.save_current_weight()

        plain_blocks = []
        html_blocks = []
        exported_emails = []

        for email, var in self.export_vars.items():
            if var.get() and email in self.db and not self.db[email].get("archived", False):
                plain_blocks.append(self.get_export_text_for_user(email))
                html_blocks.append(self.get_export_html_for_user(email))
                exported_emails.append(email)

        if not exported_emails:
            mb.showinfo("Пусто", "Выберите хотя бы одного покупателя галочкой в левой панели.")
            return

        plain_text = "\n\n" + ("\n" + "=" * 50 + "\n\n").join(plain_blocks)
        html_text = '<br><hr style="border:none;border-top:2px dashed #64748b;margin:24px 0;"><br>'.join(html_blocks)

        success = copy_rich_html_to_clipboard(plain_text, html_text)
        if not success:
            self.clipboard_clear()
            self.clipboard_append(plain_text)
            self.update()

        for email in exported_emails:
            self.db[email]["archived"] = True
            self.export_vars[email].set(False)

        self.save_db()
        self.refresh_users_list()
        if self.current_user_email in exported_emails:
            self.show_user_books(self.current_user_email)

        mb.showinfo(
            "Успех",
            f"Скопировано в буфер обмена для Outlook: {len(exported_emails)} заказов.\n"
            f"Они также перемещены в историю."
        )

    def export_to_outlook(self):
        if not self.current_user_email:
            mb.showwarning("Outlook", "Сначала выберите покупателя.")
            return

        if self.entry_weight.get().strip():
            self.save_current_weight()

        html_body = self.get_export_html_for_user(self.current_user_email)
        subject = f"Заказ — {self.db[self.current_user_email].get('fio', 'Покупатель')}"

        try:
            import win32com.client
            outlook = win32com.client.Dispatch("Outlook.Application")
            mail = outlook.CreateItem(0)
            mail.Subject = subject
            mail.HTMLBody = html_body
            mail.Display()
        except ImportError:
            mb.showwarning(
                "Outlook",
                "Для прямого вызова окна Outlook нужен пакет pywin32.\n"
                "Используйте кнопку '📋 Экспорт в буфер' и просто нажмите Ctrl+V в письме."
            )
        except Exception as e:
            mb.showerror("Outlook", f"Не удалось открыть письмо Outlook:\n{e}")

    def toggle_history(self):
        if not self.current_user_email:
            return

        if self.entry_weight.get().strip():
            self.save_current_weight()

        is_archived = self.db[self.current_user_email].get("archived", False)
        self.db[self.current_user_email]["archived"] = not is_archived

        self.save_db()
        self.refresh_users_list()
        self.show_user_books(self.current_user_email)

    def delete_current_user(self):
        if not self.current_user_email:
            return

        if mb.askyesno(
            "Подтверждение",
            "Вы уверены, что хотите НАВСЕГДА удалить этого покупателя из базы?"
        ):
            del self.db[self.current_user_email]
            self.save_db()
            self.current_user_email = None

            for widget in self.frame_books.winfo_children():
                widget.destroy()

            self.lbl_user_info.configure(text="Выберите покупателя слева")
            self.btn_export.pack_forget()
            self.btn_outlook.pack_forget()
            self.btn_history.pack_forget()
            self.btn_delete_user.pack_forget()

            self.empty_state = ctk.CTkLabel(
                self.frame_books,
                text="Выберите покупателя\n\nЗдесь появятся книги и статусы сборки",
                font=("Segoe UI", 15), text_color=COLORS["muted"], justify="center"
            )
            self.empty_state.pack(expand=True, pady=120)

            self.refresh_users_list()


if __name__ == "__main__":
    app = AlibOrderManager()
    app.mainloop()