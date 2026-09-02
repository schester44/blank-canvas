-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "webhook_attempt_status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "audit_log_action_type" AS ENUM ('USER_ROLE_UPDATED', 'SETTINGS_UPDATED', 'API_KEY_CREATED');

-- CreateEnum
CREATE TYPE "audit_log_actor_type" AS ENUM ('USER', 'SYSTEM', 'API_KEY');

-- CreateEnum
CREATE TYPE "audit_log_entity_type" AS ENUM ('USER', 'API_KEY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "ban_reason" TEXT,
    "ban_expires" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,
    "impersonated_by" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "signing_secret_ct" BYTEA NOT NULL,
    "signing_secret_nonce" BYTEA NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "idempotency_key" VARCHAR(255) NOT NULL,
    "topic" VARCHAR(255) NOT NULL,
    "resource_id" VARCHAR(255),
    "request_body" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "endpoint_id" UUID NOT NULL,
    "status" "webhook_attempt_status" NOT NULL,
    "http_code" INTEGER,
    "latency_ms" INTEGER,
    "retry_num" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "key_id" VARCHAR(255) NOT NULL,
    "hashed_secret" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action" "audit_log_action_type" NOT NULL,
    "entity_type" "audit_log_entity_type" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "actor_type" "audit_log_actor_type" NOT NULL,
    "actor_id" TEXT,
    "actor_name" VARCHAR(255),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log_entities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "audit_log_id" UUID NOT NULL,
    "entity_type" "audit_log_entity_type" NOT NULL,
    "entity_id" UUID NOT NULL,

    CONSTRAINT "audit_log_entities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_id_key" ON "accounts"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_endpoints_url_key" ON "webhook_endpoints"("url");

-- CreateIndex
CREATE INDEX "webhook_events_topic_idx" ON "webhook_events"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_idempotency_key_key" ON "webhook_events"("idempotency_key");

-- CreateIndex
CREATE INDEX "webhook_attempts_event_id_idx" ON "webhook_attempts"("event_id");

-- CreateIndex
CREATE INDEX "webhook_attempts_endpoint_id_created_at_idx" ON "webhook_attempts"("endpoint_id", "created_at");

-- CreateIndex
CREATE INDEX "webhook_attempts_status_created_at_idx" ON "webhook_attempts"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_id_key" ON "api_keys"("key_id");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_occurred_at_idx" ON "audit_log"("entity_type", "entity_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_occurred_at_idx" ON "audit_log"("occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_actor_type_actor_id_idx" ON "audit_log"("actor_type", "actor_id");

-- CreateIndex
CREATE INDEX "audit_log_entities_entity_type_entity_id_audit_log_id_idx" ON "audit_log_entities"("entity_type", "entity_id", "audit_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_log_entities_audit_log_id_entity_type_entity_id_key" ON "audit_log_entities"("audit_log_id", "entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_attempts" ADD CONSTRAINT "webhook_attempts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "webhook_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_attempts" ADD CONSTRAINT "webhook_attempts_endpoint_id_fkey" FOREIGN KEY ("endpoint_id") REFERENCES "webhook_endpoints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log_entities" ADD CONSTRAINT "audit_log_entities_audit_log_id_fkey" FOREIGN KEY ("audit_log_id") REFERENCES "audit_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

