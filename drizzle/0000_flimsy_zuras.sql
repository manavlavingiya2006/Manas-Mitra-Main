CREATE TABLE `care_documents` (
	`document_key` text PRIMARY KEY NOT NULL,
	`document_json` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
