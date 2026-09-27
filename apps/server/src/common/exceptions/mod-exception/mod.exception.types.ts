export type ModErrorCode =
  | 'account_mismatch'
  | 'bad_signature'
  | 'code_expired'
  | 'code_not_found'
  | 'code_used'
  | 'device_revoked'
  | 'invalid_code'
  | 'invalid_payload'
  | 'rate_limited'
  | 'replay_not_owned'
  | 'replayed_request'
  | 'server_error'
  | 'stale_request'
  | 'too_large'
  | 'unknown_device';

export type ModExceptionInput = {
  status: number;
  error: ModErrorCode;
  message?: string;
};
