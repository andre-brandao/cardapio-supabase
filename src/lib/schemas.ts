import { z } from 'zod';

export const produtoSchema = z.object({
	nome: z.string().min(3).max(25),
	descricao: z.string(),
	categoria: z.string(),
	sub_categoria: z.string(),

	preco: z.number(),
	image_url: z.string(),
	vegan: z.boolean(),
	visible: z.boolean()
});

export const clienteSchema = z.object({
	nome: z.string().min(3).max(25),
	telefone: z.string().min(11).max(20),
	mesa: z.string().min(1).max(10),
});