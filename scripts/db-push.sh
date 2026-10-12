#!/usr/bin/env bash
set -e

# Load environment variables from .env
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

PROJECT_REF="${SUPABASE_PROJECT_ID:-emodwlslhgmwsadlhuyq}"

if [ -n "$DATABASE_URL" ]; then
  echo "==> Pushing migrations using DATABASE_URL..."
  npx supabase db push --db-url "$DATABASE_URL"
elif [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "==> Pushing migrations using SUPABASE_ACCESS_TOKEN for project $PROJECT_REF..."
  npx supabase link --project-ref "$PROJECT_REF" --yes || true
  npx supabase db push
else
  echo ""
  echo "================================================================================"
  echo "❌ Cannot push migrations: Missing Supabase credentials in .env"
  echo "--------------------------------------------------------------------------------"
  echo "To enable automated migration pushing, add EITHER of the following to .env:"
  echo ""
  echo "Option 1 (Recommended): Supabase Personal Access Token"
  echo "  1. Generate a token at: https://supabase.com/dashboard/account/tokens"
  echo "  2. Add to .env: SUPABASE_ACCESS_TOKEN=\"sbp_...\""
  echo ""
  echo "Option 2: Direct Database URL (with database password)"
  echo "  1. Get connection URI from: Supabase Dashboard -> Settings -> Database"
  echo "  2. Add to .env: DATABASE_URL=\"postgresql://postgres.emodwlslhgmwsadlhuyq:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres\""
  echo "================================================================================"
  echo ""
  exit 1
fi
