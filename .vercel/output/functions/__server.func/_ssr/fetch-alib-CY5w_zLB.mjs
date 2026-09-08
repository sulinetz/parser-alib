import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-alib-CY5w_zLB.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchAlibPage_createServerFn_handler = createServerRpc({
	id: "3781747995073ba29d27217a8161bfb9d150eb260554057985cdb415a23244cd",
	name: "fetchAlibPage",
	filename: "src/lib/fetch-alib.ts"
}, (opts) => fetchAlibPage.__executeServer(opts));
var fetchAlibPage = createServerFn({ method: "POST" }).validator((data) => {
	if (typeof data !== "object" || data === null || !("url" in data) || typeof data.url !== "string") throw new Error("Нужна ссылка");
	const url = data.url.trim();
	if (!url.startsWith("http://") && !url.startsWith("https://")) throw new Error("Введите корректную ссылку на заказы.");
	return { url };
}).handler(fetchAlibPage_createServerFn_handler, async ({ data }) => {
	const res = await fetch(data.url, {
		headers: { "User-Agent": "Mozilla/5.0" },
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) throw new Error(`Не удалось загрузить страницу: HTTP ${res.status}`);
	const buf = await res.arrayBuffer();
	let html = "";
	try {
		html = new TextDecoder("windows-1251").decode(buf);
	} catch {
		html = new TextDecoder("utf-8").decode(buf);
	}
	return { html };
});
//#endregion
export { fetchAlibPage_createServerFn_handler };
