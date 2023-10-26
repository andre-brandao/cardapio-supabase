<script lang="ts">
	import { onMount } from 'svelte';

	// @ts-ignore
	import { default as QrCode } from 'qrious';

	export let value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

	const QRcode = new QrCode();

	export let errorCorrection = 'L';
	export let background = '#fff';
	export let color = '#000';
	export let size = '300';
	export let padding = 5;
	// export let className = 'qrcode';

	let image = '';

	function generateQrCode() {
		QRcode.set({
			background,
			foreground: color,
			level: errorCorrection,
			padding,
			size,
			value
		});

		image = QRcode.toDataURL('image/jpeg');
	}

	export function getImage() {
		return image;
	}

	$: {
		if (value) {
			generateQrCode();
		}
	}

	onMount(() => {
		generateQrCode();
	});
</script>

<img src={image} alt={value} />
