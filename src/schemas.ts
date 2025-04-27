import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  completed: z.boolean().default(false),
  priority: z.number().min(0).max(3),
  dueDate: z.date().nullish(),
  category: z.string().max(50).nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ITodo = z.infer<typeof TodoSchema>;

export const CreateTodoSchema = z.object({
  text: z.string().min(1),
  priority: z.number().min(0).max(3).optional(),
  dueDate: z.date().optional(),
  category: z.string().max(50).nullish(),
});
export type ICreateTodo = z.infer<typeof CreateTodoSchema>;

export const UpdateTodoSchema = z.object({
  text: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  priority: z.number().min(0).max(3).optional(),
  dueDate: z.date().nullish(),
  category: z.string().max(50).nullish(),
});
export type IUpdateTodo = z.infer<typeof UpdateTodoSchema>;

export const TodoParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});
export type ITodoParams = z.infer<typeof TodoParamsSchema>;

export const TodoQuerySchema = z.object({
  completed: z.boolean().optional(),
  category: z.string().nullish(),
  priority: z.number().min(0).max(3).optional(),
  dueDate: z.date().nullish(),
});
export type ITodoQuery = z.infer<typeof TodoQuerySchema>;
