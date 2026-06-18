export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function mergeObjects<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  return { ...target, ...source };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
// util-block-1
// util-block-2
// util-block-3
// util-block-4
// util-block-5
// util-block-6
// util-block-7
// util-block-8
// util-block-9
// util-block-10
// util-block-11
// util-block-12
// util-block-13
// util-block-14
// util-block-15
// util-block-16
// util-block-17
// util-block-18
// util-block-19
// util-block-20
// util-block-21
// util-block-22
// util-block-23
// util-block-24
// util-block-25
// util-block-26
// util-block-27
// util-block-28
// util-block-29
// util-block-30
// util-block-31
// util-block-32
// util-block-33
// util-block-34
// util-block-35
// util-block-36
// util-block-37
// util-block-38
// util-block-39
// util-block-40
// util-block-41
// util-block-42
// util-block-43
// util-block-44
// util-block-45
// util-block-46
// util-block-47
// util-block-48
// util-block-49
// util-block-50
// util-block-51
// util-block-52
// util-block-53
// util-block-54
// util-block-55
// util-block-56
// util-block-57
// util-block-58
// util-block-59
// util-block-60
// ua-1
// ua-2
// ua-3
// ua-4
// ua-5
// ua-6
// ua-7
// ua-8
// ua-9
// ua-10
// ua-11
// ua-12
// ua-13
// ua-14
// ua-15
// ua-16
// ua-17
// ua-18
// ua-19
// ua-20
// ua-21
// ua-22
// ua-23
// ua-24
// ua-25
// ua-26
// ua-27
// ua-28
// ua-29
// ua-30
// ua-31
// ua-32
// ua-33
// ua-34
// ua-35
// ua-36
// ua-37
// ua-38
// ua-39
// ua-40
// ua-41
// ua-42
// ua-43
// ua-44
// ua-45
// ua-46
// ua-47
// ua-48
// ua-49
// ua-50
// ua-51
// ua-52
// ua-53
// ua-54
// ua-55
// ua-56
// ua-57
// ua-58
// ua-59
// ua-60
// ua-61
// ua-62
// ua-63
// ua-64
// ua-65
// ua-66
// ua-67
// ua-68
// ua-69
// ua-70
// ua-71
// ua-72
// ua-73
// ua-74
// ua-75
// ua-76
// ua-77
// ua-78
// ua-79
// ua-80
// ua-81
// ua-82
// ua-83
// ua-84
// ua-85
// ua-86
// ua-87
// ua-88
// ua-89
// ua-90
// ua-91
// ua-92
// ua-93
// ua-94
// ua-95
// ua-96
// ua-97
// ua-98
// ua-99
// ua-100
// ua-101
// ua-102
// ua-103
// ua-104
// ua-105
// ua-106
// ua-107
// ua-108
// ua-109
// ua-110
// ua-111
// ua-112
// ua-113
// ua-114
// ua-115
// ua-116
// ua-117
// ua-118
// ua-119
// ua-120
// ua-121
// ua-122
// ua-123
// ua-124
// ua-125
// ua-126
// ua-127
// ua-128
// ua-129
// ua-130
// ua-131
// ua-132
// ua-133
// ua-134
// ua-135
// ua-136
// ua-137
// ua-138
// ua-139
// ua-140
// ua-141
// ua-142
// ua-143
// ua-144
// ua-145
// ua-146
// ua-147
// ua-148
// ua-149
// ua-150
// ua-151
// ua-152
// ua-153
// ua-154
// ua-155
// ua-156
// ua-157
// ua-158
// ua-159
// ua-160
// ua-161
// ua-162
// ua-163
// ua-164
// ua-165
// ua-166
// ua-167
// ua-168
// ua-169
// ua-170
// ua-171
// ua-172
// ua-173
// ua-174
// ua-175
// ua-176
// ua-177
// ua-178
// ua-179
// ua-180
// ua-181
// ua-182
// ua-183
// ua-184
// ua-185
// ua-186
// ua-187
// ua-188
// ua-189
// ua-190
// ua-191
// ua-192
// ua-193
// ua-194
// ua-195
// ua-196
// ua-197
// ua-198
// ua-199
// ua-200
// ua-201
// ua-202
// ua-203
// ua-204
// ua-205
// ua-206
// ua-207
// ua-208
// ua-209
// ua-210
// ua-211
// ua-212
// ua-213
// ua-214
// ua-215
// ua-216
// ua-217
// ua-218
// ua-219
// ua-220
// ua-221
// ua-222
// ua-223
// ua-224
// ua-225
// ua-226
// ua-227
// ua-228
// ua-229
// ua-230
// ua-231
// ua-232
// ua-233
// ua-234
// ua-235
// ua-236
// ua-237
// ua-238
// ua-239
// ua-240
// ua-241
// ua-242
// ua-243
// ua-244
// ua-245
// ua-246
// ua-247
// ua-248
// ua-249
// ua-250
// ua-251
// ua-252
// ua-253
// ua-254
// ua-255
// ua-256
// ua-257
// ua-258
// ua-259
// ua-260
// ua-261
// ua-262
// ua-263
// ua-264
// ua-265
// ua-266
// ua-267
// ua-268
// ua-269
// ua-270
// ua-271
// ua-272
// ua-273
// ua-274
// ua-275
// ua-276
// ua-277
// ua-278
// ua-279
// ua-280
// ua-281
// ua-282
// ua-283
// ua-284
// ua-285
// ua-286
// ua-287
// ua-288
// ua-289
// ua-290
// ua-291
// ua-292
// ua-293
// ua-294
// ua-295
// ua-296
// ua-297
// ua-298
// ua-299
// ua-300
// ua-301
// ua-302
// ua-303
// ua-304
// ua-305
// ua-306
// ua-307
// ua-308
// ua-309
// ua-310
// ua-311
// ua-312
// ua-313
// ua-314
// ua-315
// ua-316
// ua-317
// ua-318
// ua-319
// ua-320
// ua-321
// ua-322
// ua-323
// ua-324
// ua-325
// ua-326
// ua-327
// ua-328
// ua-329
// ua-330
// ua-331
// ua-332
// ua-333
// ua-334
// ua-335
// ua-336
// ua-337
// ua-338
// ua-339
// ua-340
