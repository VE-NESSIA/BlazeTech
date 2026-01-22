export const ROLE_PERMISSIONS = {
admin: [
    'alert:read',
    'alert:write',
    'case:read',
    'case:write',
    'customer:read',
    'audit:read',
    'config:write',
    'user:manage'
],

analyst: [
    'alert:read',
    'case:read',
    'case:write',
    'customer:read',
    'audit:read'
],

developer: [
    'ingestion:write',
    'ingestion:read',
    'alert:read',
    'config:read'
],

user: [
    'alert:read',
    'customer:read'
]
};
