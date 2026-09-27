import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const careDocuments=sqliteTable('care_documents',{key:text('document_key').primaryKey(),json:text('document_json').notNull(),version:integer('version').notNull().default(1)});
