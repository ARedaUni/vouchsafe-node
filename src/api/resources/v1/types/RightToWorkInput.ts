import * as core from '../../../../core';
import {
  RightToWorkInputPayload,
  rightToWorkInputPayload,
  rightToWorkInputPayloadRequest,
  rightToWorkInputPayloadResponse,
} from './RightToWorkInputPayload';

/**
 * Request payload for RightToWork verification
 */
export interface RightToWorkInput {
  payload: RightToWorkInputPayload;
}

export namespace RightToWorkInput {
  export interface Payload {
    company_name: RightToWorkInputPayload['company_name'];
    date_of_birth: RightToWorkInputPayload['date_of_birth'];
    share_code: RightToWorkInputPayload['share_code'];
  }
}

/**
 * Cast schema for the RightToWorkInput model — a bare identity (see cast.ts): this
 * export is never itself used for wire<->app rename, only referenced by name from other files.
 */
export const rightToWorkInput = core.cast.identity<RightToWorkInput>();

/**
 * Cast schema for mapping API responses to the RightToWorkInput application shape.
 * Renames wire keys to idiomatic property names; performs no validation (see cast.ts).
 */
export const rightToWorkInputResponse = core.cast.object(
  (raw: any): any => {
    if (raw === null || raw === undefined) {
      return raw;
    }
    const __declaredKeys = new Set<string>(['payload']);
    const __extras: { [key: string]: unknown } = {};
    for (const __key of globalThis.Object.keys(raw as object)) {
      if (!__declaredKeys.has(__key)) {
        __extras[__key] = (raw as { [key: string]: unknown })[__key];
      }
    }
    return {
      ...__extras,
      payload:
        raw['payload'] == null
          ? raw['payload']
          : rightToWorkInputPayloadResponse.parse(raw['payload']),
    };
  },
  ['payload'],
);

/**
 * Cast schema for mapping the RightToWorkInput application shape to API requests.
 * Renames idiomatic property names back to wire keys; performs no validation (see cast.ts).
 */
export const rightToWorkInputRequest = core.cast.object(
  (raw: any): any => {
    if (raw === null || raw === undefined) {
      return raw;
    }
    return {
      payload:
        raw['payload'] == null
          ? raw['payload']
          : rightToWorkInputPayloadRequest.parse(raw['payload']),
    };
  },
  ['payload'],
);
