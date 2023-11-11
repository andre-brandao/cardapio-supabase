import { z } from 'zod';

export const produtoSchema = z.object({
	id: z.number().optional(),
	nome: z.string().min(3).max(30).trim(),
	descricao: z.string().trim(),
	categoria: z.string().min(3).trim(),
	// sub_categoria: z.string().trim(),

	preco_in_cents: z.number().min(0),
	image_url: z.string().min(0).trim(),
	vegan: z.boolean(),
	visible: z.boolean(),

	adicional: z
		.object({
			id: z.number().optional(),
			produto_id: z.number().optional(),
			nome: z.string().min(3).max(30).trim(),
			preco_in_cents: z.number().min(0)
		})
		.array()
});

export const clienteSchema = z.object({
	nome: z.string().min(3).max(25).trim(),
	telefone: z.string().min(11).max(20).trim(),
	mesa: z.string().min(1).max(10).trim()
});

export const pedidoSchema = z.object({
	observacao: z.string(),
	quantidade: z.number().min(1),

	adicional: z.number().array()
});
