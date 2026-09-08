import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { _ as ClipboardCopy, a as Trash2, b as Camera, c as RotateCcw, d as MapPin, f as Mail, g as Clock, h as Download, l as PanelLeft, m as FileCode2, n as Workflow, o as Search, p as History, r as Undo2, s as Scale, t as X, u as Package, v as ChevronDown, x as BookOpen, y as Check } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as DialogPortal, h as Slot, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DqutoLyc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,opacity,transform,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-foreground hover:bg-accent/90",
			secondary: "bg-surface-2 text-foreground border border-border hover:bg-surface-3",
			outline: "border border-border bg-transparent text-foreground hover:bg-surface-2",
			ghost: "text-muted hover:bg-surface-2 hover:text-foreground",
			destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
			success: "bg-success text-success-foreground hover:bg-success/90",
			export: "bg-export text-export-foreground hover:bg-export/90"
		},
		size: {
			default: "h-10 px-3.5",
			sm: "h-8 px-2.5 text-xs",
			lg: "h-11 px-4",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var STATUS_LABEL = {
	pending: "Ожидает",
	found: "Найдено",
	not_found: "Не найдено",
	sold: "Продано"
};
function checkedCount(buyer) {
	return buyer.books.filter((b) => b.status !== "pending").length;
}
function sortableDate(date) {
	const full = date.match(/(\d{2})\.(\d{2})\.(\d{4})/);
	if (full) return `${full[3]}${full[2]}${full[1]}`;
	const short = date.match(/(\d{2})\.(\d{2})/);
	if (short) return `2026${short[2]}${short[1]}`;
	return "00000000";
}
function latestOrderDate(buyer) {
	return buyer.books.reduce((max, b) => {
		const d = sortableDate(b.orderDate);
		return d > max ? d : max;
	}, "00000000");
}
function sortBooks(books) {
	return [...books].sort((a, b) => sortableDate(b.orderDate).localeCompare(sortableDate(a.orderDate)));
}
var SEED_BUYERS = [
	{
		id: "b1",
		name: "Стеценко Фёдор",
		address: "Москва, ул. Ленинский проспект, д. 12, кв. 47",
		email: "stetsenko@mail.ru",
		weight: "650 г",
		archived: false,
		selected: false,
		books: [
			{
				id: "A-6502",
				title: "Воинствующий материалист",
				year: "1925",
				price: "1000 ₽",
				orderDate: "04.09.2026",
				code: "A-6502",
				photoUrl: "https://www.alib.ru",
				status: "found"
			},
			{
				id: "SBст-40792",
				title: "Догель В. А. О. Ковалевский",
				year: "1945",
				price: "400 ₽",
				orderDate: "04.09.2026",
				code: "SBст-40792",
				photoUrl: "https://www.alib.ru",
				status: "pending"
			},
			{
				id: "SBст-79039",
				title: "Кореванова Агриппина. Моя жизнь",
				year: "1936",
				price: "300 ₽",
				orderDate: "04.09.2026",
				code: "SBст-79039",
				photoUrl: "https://www.alib.ru",
				status: "pending"
			},
			{
				id: "A-5657",
				title: "Витфогель К. Наука в буржуазном обществе",
				year: "1931",
				price: "1000 ₽",
				orderDate: "04.09.2026",
				code: "A-5657",
				photoUrl: "https://www.alib.ru",
				status: "not_found"
			}
		]
	},
	{
		id: "b2",
		name: "Иванов Алексей",
		address: "Санкт-Петербург, Невский пр-т, д. 88, кв. 12",
		email: "a.ivanov@yandex.ru",
		weight: "430 г",
		archived: false,
		selected: false,
		books: [
			{
				id: "A-1180",
				title: "Мастер и Маргарита",
				year: "1967",
				price: "2500 ₽",
				orderDate: "03.09.2026",
				code: "A-1180",
				photoUrl: "https://www.alib.ru",
				status: "found"
			},
			{
				id: "A-1181",
				title: "Белая гвардия",
				year: "1929",
				price: "1800 ₽",
				orderDate: "03.09.2026",
				code: "A-1181",
				photoUrl: "https://www.alib.ru",
				status: "found"
			},
			{
				id: "SBст-2201",
				title: "Дни Турбиных",
				year: "1927",
				price: "900 ₽",
				orderDate: "03.09.2026",
				code: "SBст-2201",
				photoUrl: "https://www.alib.ru",
				status: "pending"
			}
		]
	},
	{
		id: "b3",
		name: "Петрова Мария",
		address: "Екатеринбург, ул. Малышева, д. 31",
		email: "m.petrova@gmail.com",
		weight: "",
		archived: false,
		selected: false,
		books: [{
			id: "A-3304",
			title: "Анна Каренина",
			year: "1935",
			price: "1200 ₽",
			orderDate: "02.09.2026",
			code: "A-3304",
			photoUrl: "https://www.alib.ru",
			status: "pending"
		}, {
			id: "A-3305",
			title: "Война и мир. Том I",
			year: "1949",
			price: "800 ₽",
			orderDate: "02.09.2026",
			code: "A-3305",
			photoUrl: "https://www.alib.ru",
			status: "pending"
		}]
	},
	{
		id: "b4",
		name: "Кузнецов Дмитрий",
		address: "Новосибирск, ул. Красный пр-т, д. 17",
		email: "kuznetsov.d@inbox.ru",
		weight: "980 г",
		archived: true,
		selected: false,
		books: [
			{
				id: "A-4410",
				title: "Тихий Дон. Книга первая",
				year: "1941",
				price: "1500 ₽",
				orderDate: "28.08.2026",
				code: "A-4410",
				photoUrl: "https://www.alib.ru",
				status: "found"
			},
			{
				id: "A-4411",
				title: "Поднятая целина",
				year: "1953",
				price: "600 ₽",
				orderDate: "28.08.2026",
				code: "A-4411",
				photoUrl: "https://www.alib.ru",
				status: "found"
			},
			{
				id: "SBст-890",
				title: "Судьба человека",
				year: "1957",
				price: "450 ₽",
				orderDate: "28.08.2026",
				code: "SBст-890",
				photoUrl: "https://www.alib.ru",
				status: "sold"
			}
		]
	},
	{
		id: "b5",
		name: "Смирнова Ольга",
		address: "Казань, ул. Баумана, д. 5, кв. 9",
		email: "olga.s@bk.ru",
		weight: "",
		archived: true,
		selected: false,
		books: [{
			id: "A-501",
			title: "Евгений Онегин",
			year: "1937",
			price: "2200 ₽",
			orderDate: "20.08.2026",
			code: "A-501",
			photoUrl: "https://www.alib.ru",
			status: "found"
		}]
	}
];
var SAMPLE_ALIB_HTML = `<p><b>Записки сумасшедшего</b> 1935г. Цена: 700 руб. <a href="https://www.alib.ru/photo1">фото</a></p>
<p>Код книги для BS: A-8801</p>
<p>ФИО: <b>Тестов Иван</b><br>mail: test.ivan@mail.ru<br>Адрес: Тверь, ул. Советская, д. 1<br>04.09.2026 Комментарий</p>
<hr>
<p><b>Ревизор</b> 1952г. Цена: 450 руб. <a href="/photo2">фото</a></p>
<p>Код книги для BS: A-8802</p>
<p>ФИО: <b>Тестов Иван</b><br>mail: test.ivan@mail.ru<br>Адрес: Тверь, ул. Советская, д. 1<br>04.09.2026</p>
`;
function mergeParsedInto(buyers, items) {
	let added = 0;
	const next = [...buyers];
	for (const item of items) {
		const idx = next.findIndex((b) => b.email === item.email || b.id === item.email);
		if (idx === -1) {
			next.unshift({
				id: item.email,
				name: item.name,
				address: item.address,
				email: item.email,
				weight: "",
				archived: false,
				selected: false,
				books: [{
					...item.book,
					id: item.book.code,
					status: "pending"
				}]
			});
			added += 1;
			continue;
		}
		const buyer = next[idx];
		const books = [...buyer.books];
		const bookIdx = books.findIndex((b) => b.code === item.book.code);
		if (bookIdx === -1) {
			books.push({
				...item.book,
				id: item.book.code,
				status: "pending"
			});
			added += 1;
		} else {
			const existing = books[bookIdx];
			books[bookIdx] = {
				...existing,
				price: existing.price || item.book.price,
				photoUrl: existing.photoUrl || item.book.photoUrl
			};
		}
		next[idx] = {
			...buyer,
			name: item.name || buyer.name,
			address: item.address || buyer.address,
			archived: false,
			books
		};
	}
	next.sort((a, b) => latestOrderDate(b).localeCompare(latestOrderDate(a)));
	return {
		buyers: next,
		added
	};
}
var useOrders = create()(persist((set) => ({
	buyers: SEED_BUYERS,
	activeId: "b1",
	tab: "work",
	importUrl: "",
	importHtml: "",
	setTab: (tab) => set((s) => {
		const visible = s.buyers.filter((b) => tab === "history" ? b.archived : !b.archived);
		return {
			tab,
			activeId: s.activeId && visible.some((b) => b.id === s.activeId) ? s.activeId : visible[0]?.id ?? null
		};
	}),
	setActive: (id) => set({ activeId: id }),
	setImportUrl: (importUrl) => set({ importUrl }),
	setImportHtml: (importHtml) => set({ importHtml }),
	mergeParsed: (items) => {
		let added = 0;
		set((s) => {
			const result = mergeParsedInto(s.buyers, items);
			added = result.added;
			const firstEmail = items[0]?.email;
			return {
				buyers: result.buyers,
				tab: "work",
				activeId: firstEmail ?? s.activeId,
				importHtml: ""
			};
		});
		return { added };
	},
	toggleSelect: (id) => set((s) => ({ buyers: s.buyers.map((b) => b.id === id ? {
		...b,
		selected: !b.selected
	} : b) })),
	setWeight: (id, weight) => set((s) => ({ buyers: s.buyers.map((b) => b.id === id ? {
		...b,
		weight
	} : b) })),
	setStatus: (buyerId, bookId, status) => set((s) => ({ buyers: s.buyers.map((b) => b.id !== buyerId ? b : {
		...b,
		books: b.books.map((book) => book.id === bookId || book.code === bookId ? {
			...book,
			status
		} : book)
	}) })),
	archive: (id, archived) => set((s) => ({ buyers: s.buyers.map((b) => b.id === id ? {
		...b,
		archived,
		selected: false
	} : b) })),
	archiveMany: (ids) => set((s) => {
		const setIds = new Set(ids);
		return { buyers: s.buyers.map((b) => setIds.has(b.id) ? {
			...b,
			archived: true,
			selected: false
		} : b) };
	}),
	remove: (id) => set((s) => ({
		buyers: s.buyers.filter((b) => b.id !== id),
		activeId: s.activeId === id ? null : s.activeId
	})),
	resetDemo: () => set({
		buyers: SEED_BUYERS,
		activeId: "b1",
		tab: "work"
	})
}), { name: "alib-orders-v2" }));
function AppHeader() {
	const buyers = useOrders((s) => s.buyers);
	const reset = useOrders((s) => s.resetDemo);
	const work = buyers.filter((b) => !b.archived).length;
	const history = buyers.filter((b) => b.archived).length;
	const books = buyers.reduce((n, b) => n + b.books.length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 sm:mr-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-2xl leading-none tracking-tight",
					children: "ALIB"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-2xs font-medium tracking-widest text-muted uppercase",
					children: "Менеджер заказов"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: reset,
					className: "sm:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Демо"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "size-3.5" }),
						label: "В работе",
						value: work
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
						label: "История",
						value: history
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }),
						label: "Книг",
						value: books
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: reset,
				className: "hidden sm:inline-flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Демо"]
			})
		]
	});
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums font-medium",
				children: value
			})
		]
	});
}
function BuyerList({ buyers, activeId, onSelect, onToggle, onExportSelected }) {
	const selected = buyers.filter((b) => b.selected && !b.archived);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "export",
			className: "mb-3 w-full justify-between rounded-lg",
			onClick: onExportSelected,
			disabled: selected.length === 0,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4" }), "Экспорт выбранных"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-xs opacity-80",
				children: selected.length
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5",
			children: buyers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted",
				children: "Нет заказов в этой вкладке"
			}) : buyers.map((buyer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyerCard, {
				buyer,
				active: buyer.id === activeId,
				onSelect: () => onSelect(buyer.id),
				onToggle: () => onToggle(buyer.id)
			}, buyer.id))
		})]
	});
}
function BuyerCard({ buyer, active, onSelect, onToggle }) {
	const done = checkedCount(buyer);
	const total = buyer.books.length;
	const pct = total ? done / total * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border p-3 transition-colors duration-150", active ? "border-accent/35 bg-surface-2" : "border-transparent bg-surface hover:border-border"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2.5",
			children: [!buyer.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Выбрать заказ",
				onClick: (e) => {
					e.stopPropagation();
					onToggle();
				},
				className: cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border", buyer.selected ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface"),
				children: buyer.selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-3",
					strokeWidth: 3
				}) : null
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onSelect,
				className: "min-w-0 flex-1 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-sm font-medium",
						children: buyer.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 truncate text-xs text-muted",
						children: buyer.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2.5 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1 flex-1 overflow-hidden rounded-full bg-surface-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-success",
									style: { width: `${pct}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-2xs tabular-nums text-subtle",
								children: [
									done,
									"/",
									total
								]
							}),
							buyer.weight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-2xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3" }), buyer.weight]
							}) : null
						]
					})
				]
			})]
		})
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-subtle outline-none transition-colors duration-150 focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-20 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-subtle outline-none transition-colors duration-150 focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchAlibPage = createServerFn({ method: "POST" }).validator((data) => {
	if (typeof data !== "object" || data === null || !("url" in data) || typeof data.url !== "string") throw new Error("Нужна ссылка");
	const url = data.url.trim();
	if (!url.startsWith("http://") && !url.startsWith("https://")) throw new Error("Введите корректную ссылку на заказы.");
	return { url };
}).handler(createSsrRpc("3781747995073ba29d27217a8161bfb9d150eb260554057985cdb415a23244cd"));
function stripTags(html) {
	return html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function firstBold(html) {
	const m = html.match(/<b>([\s\S]*?)<\/b>/i);
	return m ? stripTags(m[1]) : "";
}
function paragraphs(block) {
	return [...block.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => m[0]);
}
function extractPrice(text) {
	for (const re of [/Цена\s*[:\-]?\s*([\d\s]+(?:[,.]\d{1,2})?)\s*(?:руб\.?|р\.|₽)/i, /([\d\s]+(?:[,.]\d{1,2})?)\s*(?:руб\.?|р\.)/i]) {
		const m = text.match(re);
		if (m) return `${m[1].replace(/\s+/g, " ").trim()} ₽`;
	}
	return "";
}
function extractPhoto(block) {
	const tags = [...block.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
	for (const tag of tags) {
		const attrs = tag[1];
		const text = stripTags(tag[2]).toLowerCase();
		const href = attrs.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
		if (!href) continue;
		if (text.includes("фото") || href.toLowerCase().includes("photo")) {
			if (href.startsWith("http")) return href;
			return `https://www.alib.ru/${href.replace(/^\/+/, "")}`;
		}
	}
	return "";
}
function parseAlibBlock(block) {
	if (!block.trim() || block.includes("Конец списка")) return null;
	const ps = paragraphs(block);
	if (ps.length < 3) return null;
	const p0 = ps[0];
	const p1 = ps[1];
	const p2 = ps[2];
	const p0Text = stripTags(p0);
	const p1Text = stripTags(p1);
	const p2Text = stripTags(p2);
	const blockText = stripTags(block);
	const title = firstBold(p0) || "Неизвестная книга";
	const year = p0Text.match(/(\d{4})г\./)?.[1] ?? "Год?";
	const price = extractPrice(blockText);
	const photoUrl = extractPhoto(block);
	const code = (p1Text.match(/Код книги для BS:\s*(.*)/i)?.[1] ?? "").trim() || `no_code_${title.slice(0, 10)}`;
	const fioHtml = p2.match(/ФИО:\s*<b>([\s\S]*?)<\/b>/i);
	const name = fioHtml ? stripTags(fioHtml[1]) : p2Text.match(/ФИО:\s*(.+?)(?:\s+mail:|$)/i)?.[1]?.trim() || "Неизвестно";
	const email = p2Text.match(/mail:\s*([^\s)]+)/i)?.[1]?.trim() || `no_email_${name.replace(/\s+/g, "_")}`;
	let address = "";
	const addrHtml = p2.match(/Адрес:\s*([\s\S]*?)(?:<br\s*\/?>|Комментарий|ФИО)/i);
	if (addrHtml) address = stripTags(addrHtml[1]).replace(/,+$/, "");
	if (!address) address = p2Text.match(/Адрес:\s*(.+?)(?:Комментарий|ФИО|$)/i)?.[1]?.trim() ?? "";
	const orderDate = p2Text.match(/(\d{2}\.\d{2}\.\d{4})/)?.[1] ?? "??";
	return {
		email,
		name,
		address,
		book: {
			id: code,
			title,
			year,
			price,
			orderDate,
			code,
			photoUrl,
			status: "pending"
		}
	};
}
function looksLikeAlibHtml(raw) {
	const lower = raw.toLowerCase();
	return lower.includes("<p") || lower.includes("<hr");
}
function parseAlibHtml(raw) {
	const html = raw.trim();
	if (!html) return [];
	const blocks = html.split(/<hr\s*\/?>/i);
	const out = [];
	for (const block of blocks) {
		const item = parseAlibBlock(block);
		if (item) out.push(item);
	}
	return out;
}
function ImportBar() {
	const url = useOrders((s) => s.importUrl);
	const html = useOrders((s) => s.importHtml);
	const setUrl = useOrders((s) => s.setImportUrl);
	const setHtml = useOrders((s) => s.setImportHtml);
	const mergeParsed = useOrders((s) => s.mergeParsed);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	function applyParsed(raw, isManual) {
		if (!looksLikeAlibHtml(raw)) {
			toast.error("Нужен исходный HTML страницы заказов Alib, а не обычный текст.");
			if (isManual) setOpen(true);
			return;
		}
		const parsed = parseAlibHtml(raw);
		if (!parsed.length) {
			toast.error(isManual ? "В тексте не найдено новых заказов." : "На странице не удалось найти заказы.");
			return;
		}
		const { added } = mergeParsed(parsed);
		if (added > 0) toast.success(`Добавлено новых книг: ${added}`);
		else toast.message("Новых заказов нет — существующие обновлены.");
	}
	async function loadUrl() {
		const src = url.trim();
		if (!src.startsWith("http")) {
			toast.error("Введите корректную ссылку на заказы.");
			return;
		}
		setBusy(true);
		try {
			const { html: page } = await fetchAlibPage({ data: { url: src } });
			applyParsed(page, false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Не удалось загрузить. Вставьте HTML вручную.");
			setOpen(true);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border px-4 py-3 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Импорт заказов"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					placeholder: "Ссылка на страницу заказов Alib.ru",
					className: "min-w-0 flex-1 bg-surface"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: loadUrl,
						disabled: busy,
						className: "flex-1 sm:flex-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), busy ? "Загрузка…" : "Загрузить"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: () => setOpen((v) => !v),
						className: "flex-1 sm:flex-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode2, {}),
							"HTML",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4", open && "rotate-180") })
						]
					})]
				})]
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-col gap-2 sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: html,
				onChange: (e) => setHtml(e.target.value),
				placeholder: "Вставьте исходный HTML со страницы заказов Alib.ru",
				className: "min-h-24 flex-1 bg-surface font-mono text-xs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 sm:flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => applyParsed(html, true),
					children: "Распарсить"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setHtml(SAMPLE_ALIB_HTML),
					children: "Пример"
				})]
			})]
		}) : null]
	});
}
function TooltipProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration: 250,
		children
	});
}
function Tooltip({ children, content }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root3, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		asChild: true,
		children
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset: 6,
		className: cn("z-50 rounded-md border border-border bg-surface-2 px-2 py-1 text-xs text-foreground shadow-lg"),
		children: content
	}) })] });
}
function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function displayWeight(raw) {
	const w = raw.trim();
	if (!w) return "";
	return /^\d+$/.test(w) ? `${w} г` : w;
}
function statusHtml(status) {
	if (status === "found") return "<font color=\"#15803d\"><b>[✓ НАЙДЕНО]</b></font>";
	if (status === "not_found") return "<font color=\"#b91c1c\"><b>[✕ НЕ НАЙДЕНО]</b></font>";
	if (status === "sold") return "<font color=\"#7c3aed\"><b>[⛔ ПРОДАНО]</b></font>";
	return "<font color=\"#b45309\"><b>[ОЖИДАЕТ СБОРКИ]</b></font>";
}
function photoHtml(url) {
	return [
		"&nbsp;&nbsp;<span>",
		`<a href="${escapeHtml(url)}" target="_blank" `,
		"style=\"background:#2563eb;background-color:#2563eb;color:#ffffff;",
		"font-family:Segoe UI,sans-serif;font-size:9pt;font-weight:bold;",
		"text-decoration:none;padding:1px 6px;border-radius:3px;",
		"border:1px solid #1d4ed8;\">",
		"<font color=\"#ffffff\"><b>фото</b></font></a></span>"
	].join("");
}
function orderToHtml(buyer) {
	const fio = escapeHtml(buyer.name || "Неизвестно");
	const address = escapeHtml(buyer.address || "Адрес не указан");
	const weight = displayWeight(buyer.weight);
	const items = sortBooks(buyer.books).map((book) => {
		const title = escapeHtml(book.title || "?");
		const price = escapeHtml(book.price || "цена не указана");
		const photo = book.photoUrl ? photoHtml(book.photoUrl) : "";
		return `<li style="margin:6px 0;line-height:1.4;">${title} — <b>${price}</b> ${statusHtml(book.status)}${photo}</li>`;
	}).join("");
	const weightRow = weight ? `<div style="font-size:11pt;font-weight:bold;margin-bottom:8px;"><b>Общий вес:</b> ${escapeHtml(weight)}</div>` : "";
	return [
		"<div style=\"font-family:Segoe UI,Calibri,Arial,sans-serif;color:#222222;font-size:11pt;line-height:1.45;margin-bottom:18px;\">",
		`<div style="font-size:15pt;font-weight:bold;color:#0f172a;margin-bottom:4px;">Покупатель: <b>${fio}</b></div>`,
		`<div style="font-size:11pt;color:#334155;margin-bottom:6px;"><b>Адрес:</b> ${address}</div>`,
		weightRow,
		"<div style=\"border-top:2px solid #94a3b8;width:320px;margin:10px 0 12px 0;\"></div>",
		"<ol style=\"margin:0;padding-left:24px;\">",
		items,
		"</ol></div>"
	].join("");
}
function orderToText(buyer) {
	const weight = displayWeight(buyer.weight);
	const lines = [`Покупатель: ${buyer.name}`, `Адрес: ${buyer.address || "Адрес не указан"}`];
	if (weight) lines.push(`Общий вес: ${weight}`);
	lines.push("------------------------------");
	const statusMap = {
		found: "НАЙДЕНО",
		not_found: "НЕ НАЙДЕНО",
		sold: "ПРОДАНО",
		pending: "ОЖИДАЕТ СБОРКИ"
	};
	sortBooks(buyer.books).forEach((book, idx) => {
		const photo = book.photoUrl ? ` (фото: ${book.photoUrl})` : "";
		const price = book.price || "цена не указана";
		lines.push(`${idx + 1}. ${book.title} — ${price}${photo} [${statusMap[book.status]}]`);
	});
	return lines.join("\n");
}
async function copyOrdersHtml(buyers) {
	const html = buyers.map(orderToHtml).join("<br><hr style=\"border:none;border-top:2px dashed #64748b;margin:24px 0;\"><br>");
	const text = buyers.map(orderToText).join("\n\n==================================================\n\n");
	try {
		await navigator.clipboard.write([new ClipboardItem({
			"text/html": new Blob([html], { type: "text/html" }),
			"text/plain": new Blob([text], { type: "text/plain" })
		})]);
	} catch {
		await navigator.clipboard.writeText(text);
	}
}
async function copyOrderHtml(buyer) {
	await copyOrdersHtml([buyer]);
}
async function copyText(text) {
	await navigator.clipboard.writeText(text);
}
function mailtoHref(buyer) {
	const subject = encodeURIComponent(`Заказ — ${buyer.name}`);
	const body = encodeURIComponent(orderToText(buyer));
	return `mailto:${buyer.email && !buyer.email.startsWith("no_email_") ? buyer.email : ""}?subject=${subject}&body=${body}`;
}
var STATUSES = [
	"pending",
	"found",
	"not_found",
	"sold"
];
function BookRow({ index, book, onStatus }) {
	const n = String(index + 1).padStart(2, "0");
	const meta = [
		book.year && `${book.year} год`,
		book.price ? `Цена: ${book.price}` : null,
		book.orderDate && `заказ от ${book.orderDate}`,
		book.code && `Код BS: ${book.code}`
	].filter(Boolean).join("  ·  ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "rounded-xl border border-border bg-surface p-3 sm:p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 lg:flex-row lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-3 font-mono text-xs tabular-nums text-muted",
					children: n
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-pretty text-sm font-medium leading-snug",
						children: book.title
					}), meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: meta
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 lg:justify-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex rounded-lg bg-surface-3 p-0.5",
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onStatus(s),
							className: cn("h-8 rounded-md px-2 text-2xs font-medium transition-colors duration-150", book.status === s ? statusActive[s] : "text-muted hover:text-foreground"),
							children: STATUS_LABEL[s]
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						content: "Скопировать название для поиска на складе",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: async () => {
								await copyText(book.title);
								toast.success("Название скопировано");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {}), "В поиск"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						content: book.photoUrl ? "Открыть фото лота" : "Ссылка на фото не найдена",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							disabled: !book.photoUrl,
							onClick: () => {
								if (book.photoUrl) window.open(book.photoUrl, "_blank", "noopener");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {}), "Фото"]
						})
					})
				]
			})]
		})
	});
}
var statusActive = {
	pending: "bg-warn text-warn-foreground",
	found: "bg-success text-success-foreground",
	not_found: "bg-danger text-danger-foreground",
	sold: "bg-sold text-sold-foreground"
};
function Workspace({ buyer }) {
	const setWeight = useOrders((s) => s.setWeight);
	const setStatus = useOrders((s) => s.setStatus);
	const archive = useOrders((s) => s.archive);
	const setTab = useOrders((s) => s.setTab);
	const remove = useOrders((s) => s.remove);
	const [weight, setLocal] = (0, import_react.useState)(buyer.weight);
	const books = (0, import_react.useMemo)(() => sortBooks(buyer.books), [buyer.books]);
	(0, import_react.useEffect)(() => {
		setLocal(buyer.weight);
	}, [buyer.id, buyer.weight]);
	function persistWeight() {
		setWeight(buyer.id, weight.trim());
	}
	function saveWeight() {
		persistWeight();
		toast.success("Вес сохранён");
	}
	async function exportOne() {
		persistWeight();
		await copyOrderHtml({
			...buyer,
			weight: weight.trim()
		});
		toast.success("Отчёт в буфере — Ctrl+V в письме");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border px-4 py-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xs font-medium tracking-widest text-muted uppercase",
							children: "Текущий покупатель"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-medium tracking-tight text-balance",
							children: buyer.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex items-start gap-1.5 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: buyer.address || "Адрес не указан" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4 text-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"aria-label": "Общий вес",
								value: weight,
								onChange: (e) => setLocal(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") exportOne();
								},
								placeholder: "600 г или 1.2 кг",
								className: "h-8 w-32 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: saveWeight,
								children: "Сохранить"
							})
						]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					buyer.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => {
							persistWeight();
							archive(buyer.id, false);
							setTab("work");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {}), "Вернуть в работу"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						onClick: () => {
							if (confirm("Удалить этого покупателя из базы безвозвратно?")) remove(buyer.id);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Удалить"]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => {
							persistWeight();
							archive(buyer.id, true);
							setTab("history");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {}), "В историю"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: mailtoHref({
								...buyer,
								weight: weight.trim()
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {}), "Outlook"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void exportOne(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCopy, {}), "Экспорт в буфер"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-6",
			children: books.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookRow, {
				index: i,
				book,
				onStatus: (status) => setStatus(buyer.id, book.id, status)
			}, book.id))
		})]
	});
}
function EmptyWorkspace() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-1 items-center justify-center p-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl text-foreground",
			children: "Выберите покупателя слева"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-sm text-pretty text-sm text-muted",
			children: "Здесь появятся книги и статусы сборки. Enter в поле веса сразу копирует отчёт в буфер."
		})] })
	});
}
function Sheet({ open, onOpenChange, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: cn("fixed inset-y-0 left-0 z-50 flex w-full max-w-80 flex-col border-r border-border bg-bg-elevated p-3 shadow-xl outline-none"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children
			})]
		})] })
	});
}
function OrderApp() {
	const buyers = useOrders((s) => s.buyers);
	const tab = useOrders((s) => s.tab);
	const setTab = useOrders((s) => s.setTab);
	const activeId = useOrders((s) => s.activeId);
	const setActive = useOrders((s) => s.setActive);
	const toggleSelect = useOrders((s) => s.toggleSelect);
	const archiveMany = useOrders((s) => s.archiveMany);
	const [sheet, setSheet] = (0, import_react.useState)(false);
	const visible = (0, import_react.useMemo)(() => buyers.filter((b) => tab === "history" ? b.archived : !b.archived).sort((a, b) => latestOrderDate(b).localeCompare(latestOrderDate(a))), [buyers, tab]);
	const active = buyers.find((b) => b.id === activeId) ?? null;
	async function exportSelected() {
		const pack = buyers.filter((b) => b.selected && !b.archived);
		if (!pack.length) {
			toast.error("Отметьте хотя бы одного покупателя слева.");
			return;
		}
		await copyOrdersHtml(pack);
		archiveMany(pack.map((b) => b.id));
		toast.success(`Скопировано в буфер: ${pack.length}. Заказы ушли в историю.`);
	}
	const list = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 grid grid-cols-2 rounded-lg bg-surface-3 p-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("work"),
				className: cn("h-9 rounded-md text-sm font-medium", tab === "work" ? "bg-surface text-foreground" : "text-muted"),
				children: "В работе"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("history"),
				className: cn("h-9 rounded-md text-sm font-medium", tab === "history" ? "bg-surface text-foreground" : "text-muted"),
				children: "История"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyerList, {
			buyers: visible,
			activeId,
			onSelect: (id) => {
				setActive(id);
				setSheet(false);
			},
			onToggle: toggleSelect,
			onExportSelected: exportSelected
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bg text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-80 shrink-0 border-r border-border p-3 md:flex md:flex-col",
					children: list
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 border-b border-border px-3 py-2 md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => setSheet(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, {}), "Покупатели"]
						})
					}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, { buyer: active }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyWorkspace, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: sheet,
				onOpenChange: setSheet,
				title: "Покупатели",
				children: list
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right"
			})
		]
	}) });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderApp, {});
}
//#endregion
export { Home as component };
