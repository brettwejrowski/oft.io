
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/c" | "/c/[slug]" | "/post" | "/post/[id]" | "/submit";
		RouteParams(): {
			"/c/[slug]": { slug: string };
			"/post/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { slug?: string; id?: string };
			"/c": { slug?: string };
			"/c/[slug]": { slug: string };
			"/post": { id?: string };
			"/post/[id]": { id: string };
			"/submit": Record<string, never>
		};
		Pathname(): "/" | `/c/${string}` & {} | `/post/${string}` & {} | "/submit";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}