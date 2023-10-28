import { z } from 'zod';

export const produtoSchema = z.object({
	nome: z.string().min(3).max(30).trim(),
	descricao: z.string().trim(),
	categoria: z.string().trim(),
	sub_categoria: z.string().trim(),

	preco_in_cents: z.number(),
	image_url: z.string().min(0).trim(),
	vegan: z.boolean(),
	visible: z.boolean()
});

export const clienteSchema = z.object({
	nome: z.string().min(3).max(25).trim(),
	telefone: z.string().min(11).max(20).trim(),
	mesa: z.string().min(1).max(10).trim(),
});