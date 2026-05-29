import db from '../db';

interface AuditLogFilters {
  actor?: string;
  action?: string;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
  withTotal?: boolean;
}

export async function getAuditLogs(
  filters: AuditLogFilters,
) {
  const {
    actor,
    action,
    from,
    to,
    cursor,
    limit = 25,
    withTotal,
  } = filters;

  let query = db('audit_logs')
    .orderBy('created_at', 'desc')
    .limit(limit + 1);

  if (actor) {
    query = query.where(
      'actor',
      actor,
    );
  }

  if (action) {
    query = query.where(
      'action',
      action,
    );
  }

  if (from) {
    query = query.where(
      'created_at',
      '>=',
      from,
    );
  }

  if (to) {
    query = query.where(
      'created_at',
      '<=',
      to,
    );
  }

  if (cursor) {
    query = query.where(
      'id',
      '<',
      cursor,
    );
  }

  const rows = await query;

  const hasNext =
    rows.length > limit;

  const data = rows.slice(0, limit);

  let total;

  if (withTotal === true) {
    const result = await db(
      'audit_logs',
    )
      .count('* as count')
      .first();

    total = Number(result?.count ?? 0);
  }

  return {
    data,
    nextCursor: hasNext
      ? data[data.length - 1].id
      : null,
    total,
  };
}