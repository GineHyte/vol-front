<script lang="ts">
	import { tick } from 'svelte';
	import { t } from '$lib/utils/utils';

	interface Props {
		target: HTMLElement | null | undefined;
		deleteFunc?: (currentId: number) => Promise<void>;
		duplicateFunc?: (currentId: number) => Promise<void>;
		deepDuplicateFunc?: (currentId: number) => Promise<void>;
		editFunc?: (currentId: number) => Promise<void>;
		updateFunc: () => void;
	}

	let {
		target,
		deleteFunc,
		duplicateFunc,
		editFunc,
		updateFunc,
		deepDuplicateFunc,
	}: Props = $props();

	let open = $state(false);
	let x = $state(0);
	let y = $state(0);
	let currentId: number | null = $state(null);
	let menuEl: HTMLUListElement | undefined = $state();

	function resolveRowId(detail: EventTarget | null) {
		if (!(detail instanceof HTMLElement)) return null;
		const rowEl = detail.id ? detail : detail.closest('[id]');
		if (!rowEl?.id) return null;
		const id = Number(rowEl.id);
		return Number.isNaN(id) ? null : id;
	}

	function close() {
		open = false;
	}

	async function openMenu(e: MouseEvent) {
		e.preventDefault();
		currentId = resolveRowId(e.target);
		x = e.clientX;
		y = e.clientY;
		open = true;

		await tick();

		if (!menuEl) return;

		const { width, height } = menuEl.getBoundingClientRect();
		if (window.innerWidth - width < x) x = e.clientX - width;
		if (window.innerHeight - height < y) y = e.clientY - height;
	}

	async function runAction(action?: (currentId: number) => Promise<void>) {
		if (currentId && action) await action(currentId);
		updateFunc();
		close();
	}

	$effect(() => {
		if (!target) return;

		target.addEventListener('contextmenu', openMenu);
		return () => target.removeEventListener('contextmenu', openMenu);
	});
</script>

<svelte:window
	onclick={() => {
		if (open) close();
	}}
	onkeydown={(e) => {
		if (open && e.key === 'Escape') close();
	}}
/>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<ul
		bind:this={menuEl}
		role="menu"
		tabindex="-1"
		class="bx--menu bx--menu--open bx--menu--root fixed z-[9100]"
		style:left="{x}px"
		style:top="{y}px"
		onclick={(e) => e.stopPropagation()}
	>
		{#if deleteFunc}
			<li
				role="menuitem"
				tabindex="-1"
				class="bx--menu-option bx--menu-option--danger"
				onclick={() => runAction(deleteFunc)}
			>
				<div class="bx--menu-option__content">
					<div class="bx--menu-option__icon"></div>
					<span class="bx--menu-option__label">{t('common.delete')}</span>
				</div>
			</li>
		{/if}
		{#if duplicateFunc}
			<li
				role="menuitem"
				tabindex="-1"
				class="bx--menu-option"
				onclick={() => runAction(duplicateFunc)}
			>
				<div class="bx--menu-option__content">
					<div class="bx--menu-option__icon"></div>
					<span class="bx--menu-option__label">{t('common.duplicate')}</span>
				</div>
			</li>
		{/if}
		{#if editFunc}
			<li
				role="menuitem"
				tabindex="-1"
				class="bx--menu-option"
				onclick={() => runAction(editFunc)}
			>
				<div class="bx--menu-option__content">
					<div class="bx--menu-option__icon"></div>
					<span class="bx--menu-option__label">{t('common.edit')}</span>
				</div>
			</li>
		{/if}
		{#if deepDuplicateFunc}
			<li
				role="menuitem"
				tabindex="-1"
				class="bx--menu-option"
				onclick={() => runAction(deepDuplicateFunc)}
			>
				<div class="bx--menu-option__content">
					<div class="bx--menu-option__icon"></div>
					<span class="bx--menu-option__label">{t('common.deepDuplicate')}</span>
				</div>
			</li>
		{/if}
		<li
			role="menuitem"
			tabindex="-1"
			class="bx--menu-option"
			onclick={() => {
				updateFunc();
				close();
			}}
		>
			<div class="bx--menu-option__content">
				<div class="bx--menu-option__icon"></div>
				<span class="bx--menu-option__label">{t('common.update')}</span>
			</div>
		</li>
	</ul>
{/if}
