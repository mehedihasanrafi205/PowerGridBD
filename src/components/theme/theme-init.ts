/**
 * Inline theme initialization script.
 *
 * Runs synchronously during HTML parsing — before React
 * hydration — so the correct `.dark` class is applied to
 * <html> before any content paints. This prevents a flash
 * of the incorrect theme on first load.
 *
 * Reads the persisted preference from localStorage; when no
 * preference is stored (or in System mode), it follows the
 * OS-level `prefers-color-scheme`.
 *
 * Rendered as the first child of <body> in the root layout.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("powergridbd-theme")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;if(d){r.classList.add("dark")}else{r.classList.remove("dark")}}catch(e){}})();`;
