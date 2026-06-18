import type { District, HiddenMystery, Landmark, OnboardingStep, SearchResult } from "@/types/world";

export const worldBirthDate = "2026-06-18T00:00:00.000Z";

export const districts: District[] = [
  {
    key: "nature",
    name: "Nature District",
    description: "Soft hills, old roots, bird paths, and the Ancient Tree.",
    position: { x: -10, y: 0, z: -7 },
    color: "#6f9a57"
  },
  {
    key: "creator",
    name: "Creator District",
    description: "Studios, maker homes, gallery paths, and citizen creations.",
    position: { x: -4, y: 0, z: -10 },
    color: "#c88768"
  },
  {
    key: "startup",
    name: "Startup District",
    description: "Tiny workshops for future builders and ambitious dreams.",
    position: { x: 4, y: 0, z: -10 },
    color: "#d2a85d"
  },
  {
    key: "gaming",
    name: "Gaming District",
    description: "Playful arcades, glowing paths, and challenge markers.",
    position: { x: 10, y: 0, z: -6 },
    color: "#7d76c9"
  },
  {
    key: "dream",
    name: "Dream District",
    description: "Dream objects rise toward the night sky and become stars.",
    position: { x: 9, y: 0, z: 5 },
    color: "#9b75c9"
  },
  {
    key: "legacy",
    name: "Legacy District",
    description: "History paths, time capsules, and citizen legacy books.",
    position: { x: 2, y: 0, z: 10 },
    color: "#b98b4c"
  },
  {
    key: "mystery",
    name: "Mystery District",
    description: "Fog, hidden ruins, secret gardens, and forgotten archives.",
    position: { x: -6, y: 0, z: 9 },
    color: "#4f5d6f"
  },
  {
    key: "future",
    name: "Future District",
    description: "Observatory paths and structures not yet chosen by citizens.",
    position: { x: -11, y: 0, z: 3 },
    color: "#68a8b2"
  }
];

export const starterLandmarks: Landmark[] = [
  {
    id: "founder-monument",
    name: "Founder Monument",
    description: "The first permanent mark in Bloomverse, dedicated to the creator of the world.",
    district: "legacy",
    position: { x: 0, y: 0, z: 3 },
    kind: "monument"
  },
  {
    id: "bloom-central-plaza",
    name: "Bloom Central Plaza",
    description: "The living center where citizens arrive and world history begins.",
    district: "creator",
    position: { x: 0, y: 0, z: 0 },
    kind: "plaza"
  },
  {
    id: "ancient-tree",
    name: "Ancient Tree",
    description: "A giant rootbound guardian watching the Nature District grow.",
    district: "nature",
    position: { x: -9, y: 0, z: -5 },
    kind: "tree"
  },
  {
    id: "dream-fountain",
    name: "Dream Fountain",
    description: "A quiet fountain where citizen dreams gather before rising into the sky.",
    district: "dream",
    position: { x: 6, y: 0, z: 4 },
    kind: "fountain"
  },
  {
    id: "community-library",
    name: "Community Library",
    description: "A warm archive for stories, quotes, discoveries, and legacy books.",
    district: "creator",
    position: { x: -4, y: 0, z: -4 },
    kind: "library"
  },
  {
    id: "hall-of-legends",
    name: "Hall Of Legends",
    description: "The place where the most loved citizens and landmarks are remembered.",
    district: "legacy",
    position: { x: 4, y: 0, z: 7 },
    kind: "hall"
  },
  {
    id: "observatory",
    name: "Observatory",
    description: "A quiet tower for dream sky watching, shooting stars, and future signals.",
    district: "future",
    position: { x: -10, y: 0, z: 3 },
    kind: "observatory"
  },
  {
    id: "bloomverse-museum",
    name: "Bloomverse Museum",
    description: "A museum for civilization milestones, community events, and discoveries.",
    district: "legacy",
    position: { x: -2, y: 0, z: 8 },
    kind: "museum"
  }
];

export const hiddenMysteries: HiddenMystery[] = [
  { id: "secret-cave", name: "Secret Cave", position: { x: -8, y: 0, z: 11 } },
  { id: "lost-founder-message", name: "Lost Founder Message", position: { x: 1, y: 0, z: 4 } },
  { id: "ancient-ruins", name: "Ancient Ruins", position: { x: -7, y: 0, z: 8 } },
  { id: "hidden-observatory-notes", name: "Hidden Observatory Notes", position: { x: -11, y: 0, z: 4 } },
  { id: "secret-garden", name: "Secret Garden", position: { x: -11, y: 0, z: -9 } },
  { id: "mystery-statue", name: "Mystery Statue", position: { x: -4, y: 0, z: 9 } },
  { id: "forgotten-citizen-archive", name: "Forgotten Citizen Archive", position: { x: -2, y: 0, z: 9 } }
];

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome To Bloomverse",
    body: "Bloomverse is a living digital civilization. Every citizen contributes to the world, and every contribution becomes part of permanent history.",
    targetLabel: "Bloomverse",
    position: { x: 0, y: 0, z: 0 },
    spotlight: { x: "50%", y: "48%", size: "34vmin" }
  },
  {
    id: "founder-monument",
    title: "Founder Monument",
    body: "This permanent landmark represents the first era of Bloomverse and acts as the centerpiece of civilization history.",
    targetLabel: "Founder Monument",
    position: { x: 0, y: 0, z: 3 },
    spotlight: { x: "49%", y: "45%", size: "24vmin" }
  },
  {
    id: "central-plaza",
    title: "Central Plaza",
    body: "The main social hub, starting location, and meeting point where citizens begin their journey.",
    targetLabel: "Bloom Central Plaza",
    position: { x: 0, y: 0, z: 0 },
    spotlight: { x: "50%", y: "52%", size: "28vmin" }
  },
  {
    id: "districts",
    title: "Districts",
    body: "Eight districts shape the civilization: Nature, Creator, Startup, Gaming, Dream, Legacy, Mystery, and Future.",
    targetLabel: "District ring",
    position: { x: 7, y: 0, z: -2 },
    spotlight: { x: "58%", y: "48%", size: "42vmin" }
  },
  {
    id: "citizen-homes",
    title: "Citizen Homes",
    body: "Citizen homes represent profiles, identities, dreams, and permanent places inside the civilization.",
    targetLabel: "Citizen home grove",
    position: { x: 3, y: 0, z: -5 },
    spotlight: { x: "54%", y: "43%", size: "24vmin" }
  },
  {
    id: "dream-objects",
    title: "Dream Objects",
    body: "Dreams become physical objects: rockets, studios, game companies, dream houses, sports cars, and travel goals.",
    targetLabel: "Dream District",
    position: { x: 7, y: 0, z: 5 },
    spotlight: { x: "61%", y: "52%", size: "28vmin" }
  },
  {
    id: "search-system",
    title: "Search System",
    body: "Search citizens, dreams, landmarks, districts, events, and timeline entries. Results glide the camera through the world.",
    targetLabel: "Search artifact",
    position: { x: 0, y: 0, z: 0 },
    spotlight: { x: "50%", y: "12%", size: "28vmin" }
  },
  {
    id: "hall-of-legends",
    title: "Hall Of Legends",
    body: "The Hall displays top citizens, famous landmarks, community heroes, and reputation legends.",
    targetLabel: "Hall Of Legends",
    position: { x: 4, y: 0, z: 7 },
    spotlight: { x: "55%", y: "55%", size: "24vmin" }
  },
  {
    id: "community-events",
    title: "Community Events",
    body: "Voting, weekly events, world expansion, and global structures let the community shape the map.",
    targetLabel: "Community event path",
    position: { x: 0, y: 0, z: 0 },
    spotlight: { x: "50%", y: "76%", size: "28vmin" }
  },
  {
    id: "discovery-journal",
    title: "Discovery Journal",
    body: "Exploration reveals mysteries, secrets, hidden locations, rare events, ancient ruins, and lost messages.",
    targetLabel: "Mystery District",
    position: { x: -6, y: 0, z: 9 },
    spotlight: { x: "42%", y: "58%", size: "30vmin" }
  },
  {
    id: "time-capsules",
    title: "Time Capsules",
    body: "Citizens leave messages to future citizens with unlock dates and historical records.",
    targetLabel: "Legacy District",
    position: { x: 2, y: 0, z: 10 },
    spotlight: { x: "51%", y: "61%", size: "28vmin" }
  },
  {
    id: "help-center",
    title: "Help Center",
    body: "The magical guide orb opens the in-game encyclopedia, adventure journal, and civilization handbook.",
    targetLabel: "Help Crystal",
    position: { x: 0, y: 0, z: 0 },
    spotlight: { x: "92%", y: "84%", size: "20vmin" }
  },
  {
    id: "creator-section",
    title: "Creator Section",
    body: "The premium credits card honors MKR Infinity with creator links and support actions.",
    targetLabel: "Creator card",
    position: { x: 0, y: 0, z: 0 },
    spotlight: { x: "74%", y: "46%", size: "28vmin" }
  },
  {
    id: "finish",
    title: "You Are Ready",
    body: "You are ready to explore, become a citizen, leave a dream, and shape Bloomverse history.",
    targetLabel: "Become a Citizen",
    position: { x: 0, y: 0, z: 0 },
    spotlight: { x: "50%", y: "84%", size: "30vmin" }
  }
];

export function buildStaticSearchIndex(): SearchResult[] {
  const landmarkResults = starterLandmarks.map((landmark) => ({
    id: landmark.id,
    label: landmark.name,
    type: "landmark" as const,
    description: landmark.description,
    position: landmark.position
  }));

  const districtResults = districts.map((district) => ({
    id: district.key,
    label: district.name,
    type: "district" as const,
    description: district.description,
    position: district.position
  }));

  return [...landmarkResults, ...districtResults];
}
// add Spring district flowers
// add Summer district vegetation
// add Autumn district colors
// add Winter district effects
// add Marketplace district stalls
// add Innovation Hub tech elements
// add Garden District plants
// add Riverside District water effects
// add additional landmark descriptions
// add district-specific ambient sounds
// add Spring district flowers
// add Summer district vegetation
// add Autumn district colors
// add Winter district effects
// add Marketplace district stalls
// add Innovation Hub tech elements
// add Garden District plants
// add Riverside District water effects
// add additional landmark descriptions
// add district-specific ambient sounds
// add Spring district flowers
// add Summer district vegetation
// add Autumn district colors
// add Winter district effects
// add Marketplace district stalls
// add Innovation Hub tech elements
// add Garden District plants
// add Riverside District water effects
// add additional landmark descriptions
// add district-specific ambient sounds
// add Spring district flowers
// add Summer district vegetation
// add Autumn district colors
// add Winter district effects
// add Marketplace district stalls
// add Innovation Hub tech elements
// add Garden District plants
// add Riverside District water effects
// add additional landmark descriptions
// add district-specific ambient sounds
# District color scheme
# Landmark spawn points
# Citizen home locations
# Resource node positions
# Quest starting points
# Discovery locations
# Shop NPC positions
# Event spawn areas
# Weather zone boundaries
# Biome borders
# Building placement rules
# Decoration density map
# Tree growth stages
# Water flow directions
# Wildlife spawn rates
# Sound ambiance zones
# Light pollution map
# Wind tunnel paths
# Seasonal color palettes
# Terrain height modifiers
// data-block-1
// data-block-2
// data-block-3
// data-block-4
// data-block-5
// data-block-6
// data-block-7
// data-block-8
// data-block-9
// data-block-10
// data-block-11
// data-block-12
// data-block-13
// data-block-14
// data-block-15
// data-block-16
// data-block-17
// data-block-18
// data-block-19
// data-block-20
// data-block-21
// data-block-22
// data-block-23
// data-block-24
// data-block-25
// data-block-26
// data-block-27
// data-block-28
// data-block-29
// data-block-30
// data-block-31
// data-block-32
// data-block-33
// data-block-34
// data-block-35
// data-block-36
// data-block-37
// data-block-38
// data-block-39
// data-block-40
// data-block-41
// data-block-42
// data-block-43
// data-block-44
// data-block-45
// data-block-46
// data-block-47
// data-block-48
// data-block-49
// data-block-50
// data-block-51
// data-block-52
// data-block-53
// data-block-54
// data-block-55
// data-block-56
// data-block-57
// data-block-58
// data-block-59
// data-block-60
// data-block-61
// data-block-62
// data-block-63
// data-block-64
// data-block-65
// data-block-66
// data-block-67
// data-block-68
// data-block-69
// data-block-70
// data-block-71
// data-block-72
// data-block-73
// data-block-74
// data-block-75
// data-block-76
// data-block-77
// data-block-78
// data-block-79
// data-block-80
// data-block-81
// data-block-82
// data-block-83
// data-block-84
// data-block-85
// data-block-86
// data-block-87
// data-block-88
// data-block-89
// data-block-90
// data-block-91
// data-block-92
// data-block-93
// data-block-94
// data-block-95
// data-block-96
// data-block-97
// data-block-98
// data-block-99
// data-block-100
// d-1
// d-2
// d-3
// d-4
// d-5
// d-6
// d-7
// d-8
// d-9
// d-10
// d-11
// d-12
// d-13
// d-14
// d-15
// d-16
// d-17
// d-18
// d-19
// d-20
// d-21
// d-22
// d-23
// d-24
// d-25
// d-26
// d-27
// d-28
// d-29
// d-30
// d-31
// d-32
// d-33
// d-34
// d-35
// d-36
// d-37
// d-38
// d-39
// d-40
// d-41
// d-42
// d-43
// d-44
// d-45
// d-46
// d-47
// d-48
// d-49
// d-50
// d-51
// d-52
// d-53
// d-54
// d-55
// d-56
// d-57
// d-58
// d-59
// d-60
// d-61
// d-62
// d-63
// d-64
// d-65
// d-66
// d-67
// d-68
// d-69
// d-70
// d-71
// d-72
// d-73
// d-74
// d-75
// d-76
// d-77
// d-78
// d-79
// d-80
// d-81
// d-82
// d-83
// d-84
// d-85
// d-86
// d-87
// d-88
// d-89
// d-90
// d-91
// d-92
// d-93
// d-94
// d-95
// d-96
// d-97
// d-98
// d-99
// d-100
// d-101
// d-102
// d-103
// d-104
// d-105
// d-106
// d-107
// d-108
// d-109
// d-110
// d-111
// d-112
// d-113
// d-114
// d-115
// d-116
// d-117
// d-118
// d-119
// d-120
// d-121
// d-122
// d-123
// d-124
// d-125
// d-126
// d-127
// d-128
// d-129
// d-130
// d-131
// d-132
// d-133
// d-134
// d-135
// d-136
// d-137
// d-138
// d-139
// d-140
// d-141
// d-142
// d-143
// d-144
// d-145
// d-146
// d-147
// d-148
// d-149
// d-150
// d-151
// d-152
// d-153
// d-154
// d-155
// d-156
// d-157
// d-158
// d-159
// d-160
// d-161
// d-162
// d-163
// d-164
// d-165
// d-166
// d-167
// d-168
// d-169
// d-170
// d-171
// d-172
// d-173
// d-174
// d-175
// d-176
// d-177
// d-178
// d-179
// d-180
// d-181
// d-182
// d-183
// d-184
// d-185
// d-186
// d-187
// d-188
// d-189
// d-190
// d-191
// d-192
// d-193
// d-194
// d-195
// d-196
// d-197
// d-198
// d-199
// d-200
// d-201
// d-202
// d-203
// d-204
// d-205
// d-206
// d-207
// d-208
// d-209
// d-210
// d-211
// d-212
// d-213
// d-214
// d-215
// d-216
// d-217
// d-218
// d-219
// d-220
// d-221
// d-222
// d-223
// d-224
// d-225
// d-226
// d-227
// d-228
// d-229
// d-230
// d-231
// d-232
// d-233
// d-234
// d-235
// d-236
// d-237
// d-238
// d-239
// d-240
// d-241
// d-242
// d-243
// d-244
// d-245
// d-246
// d-247
// d-248
// d-249
// d-250
// d-251
// d-252
// d-253
// d-254
// d-255
// d-256
// d-257
// d-258
// d-259
// d-260
// d-261
// d-262
// d-263
// d-264
// d-265
// d-266
// d-267
// d-268
// d-269
// d-270
// d-271
// d-272
// d-273
// d-274
// d-275
// d-276
// d-277
// d-278
// d-279
// d-280
// d-281
// d-282
// d-283
// d-284
// d-285
// d-286
// d-287
// d-288
// d-289
// d-290
// d-291
// d-292
// d-293
// d-294
// d-295
// d-296
// d-297
// d-298
// d-299
// d-300
// d-301
// d-302
// d-303
// d-304
// d-305
// d-306
// d-307
// d-308
// d-309
// d-310
// d-311
// d-312
// d-313
// d-314
// d-315
// d-316
// d-317
// d-318
// d-319
// d-320
// d-321
// d-322
// d-323
// d-324
// d-325
// d-326
// d-327
// d-328
// d-329
// d-330
// d-331
// d-332
// d-333
// d-334
// d-335
// d-336
// d-337
// d-338
// d-339
// d-340
// d-341
// d-342
// d-343
// d-344
// d-345
// d-346
// d-347
// d-348
// d-349
// d-350
// d-351
// d-352
// d-353
// d-354
// d-355
// d-356
// d-357
// d-358
// d-359
// d-360
// d-361
// d-362
// d-363
// d-364
// d-365
// d-366
// d-367
// d-368
// d-369
// d-370
// d-371
// d-372
// d-373
// d-374
// d-375
// d-376
// d-377
// d-378
// d-379
// d-380
// d-381
// d-382
// d-383
// d-384
// d-385
// d-386
// d-387
// d-388
// d-389
// d-390
// d-391
// d-392
// d-393
// d-394
// d-395
// d-396
// d-397
// d-398
// d-399
// d-400
// d-401
// d-402
// d-403
// d-404
// d-405
// d-406
// d-407
// d-408
// d-409
// d-410
// d-411
// d-412
// d-413
// d-414
// d-415
// d-416
// d-417
// d-418
// d-419
// d-420
// d-421
// d-422
// d-423
// d-424
// d-425
// d-426
// d-427
// d-428
// d-429
// d-430
// d-431
// d-432
// d-433
// d-434
// d-435
// d-436
// d-437
// d-438
// d-439
// d-440
// d-441
// d-442
// d-443
// d-444
// d-445
// d-446
// d-447
// d-448
// d-449
// d-450
// d-451
// d-452
// d-453
// d-454
// d-455
// d-456
// d-457
// d-458
// d-459
// d-460
// d-461
// d-462
// d-463
// d-464
// d-465
// d-466
// d-467
// d-468
// d-469
// d-470
// d-471
// d-472
// d-473
// d-474
// d-475
// d-476
// d-477
// d-478
// d-479
// d-480
// d-481
// d-482
// d-483
// d-484
// d-485
// d-486
// d-487
// d-488
// d-489
// d-490
// d-491
// d-492
// d-493
// d-494
// d-495
// d-496
// d-497
// d-498
// d-499
// d-500
// d-501
// d-502
// d-503
// d-504
// d-505
// d-506
// d-507
// d-508
// d-509
// d-510
// d-511
// d-512
// d-513
// d-514
// d-515
// d-516
// d-517
// d-518
// d-519
// d-520
// d-521
// d-522
// d-523
// d-524
// d-525
// d-526
// d-527
// d-528
// d-529
// d-530
// d-531
// d-532
// d-533
// d-534
// d-535
// d-536
// d-537
// d-538
// d-539
// d-540
// d-541
// d-542
// d-543
// d-544
// d-545
// d-546
// d-547
// d-548
// d-549
// d-550
// d-551
// d-552
// d-553
// d-554
// d-555
// d-556
// d-557
// d-558
// d-559
// d-560
// d-561
// d-562
// d-563
// d-564
// d-565
// d-566
// d-567
// d-568
// d-569
// d-570
// d-571
// d-572
// d-573
// d-574
// d-575
// d-576
// d-577
// d-578
// d-579
// d-580
// d-581
// d-582
// d-583
// d-584
// d-585
// d-586
// d-587
// d-588
// d-589
// d-590
// d-591
// d-592
// d-593
// d-594
// d-595
// d-596
// d-597
// d-598
// d-599
// d-600
// d-601
// d-602
// d-603
// d-604
// d-605
// d-606
// d-607
// d-608
// d-609
// d-610
// d-611
// d-612
// d-613
// d-614
// d-615
// d-616
// d-617
// d-618
// d-619
// d-620
// d-621
// d-622
// d-623
// d-624
// d-625
// d-626
// d-627
// d-628
// d-629
// d-630
// d-631
// d-632
// d-633
// d-634
// d-635
// d-636
// d-637
// d-638
// d-639
// d-640
// d-641
// d-642
// d-643
// d-644
// d-645
// d-646
// d-647
// d-648
// d-649
// d-650
// d-651
// d-652
// d-653
// d-654
// d-655
// d-656
// d-657
// d-658
// d-659
// d-660
// d-661
// d-662
// d-663
// d-664
// d-665
// d-666
// d-667
// d-668
// d-669
// d-670
// d-671
// d-672
// d-673
// d-674
// d-675
// d-676
// d-677
// d-678
// d-679
// d-680
// d-681
// d-682
// d-683
// d-684
// d-685
// d-686
// d-687
// d-688
// d-689
// d-690
// d-691
// d-692
// d-693
// d-694
// d-695
// d-696
// d-697
// d-698
// d-699
// d-700
// d-701
// d-702
// d-703
// d-704
// d-705
// d-706
// d-707
// d-708
// d-709
// d-710
// d-711
// d-712
// d-713
// d-714
// d-715
// d-716
// d-717
// d-718
// d-719
// d-720
// d-721
// d-722
// d-723
// d-724
// d-725
// d-726
// d-727
// d-728
// d-729
// d-730
// d-731
// d-732
// d-733
// d-734
// d-735
// d-736
// d-737
// d-738
// d-739
// d-740
// d-741
// d-742
// d-743
// d-744
// d-745
// d-746
// d-747
// d-748
// d-749
// d-750
// d-751
// d-752
// d-753
// d-754
// d-755
// d-756
// d-757
// d-758
// d-759
// d-760
// d-761
// d-762
// d-763
// d-764
// d-765
// d-766
// d-767
// d-768
// d-769
// d-770
// d-771
// d-772
// d-773
// d-774
// d-775
// d-776
// d-777
// d-778
// d-779
// d-780
// d-781
// d-782
// d-783
// d-784
// d-785
// d-786
// d-787
// d-788
// d-789
// d-790
// d-791
// d-792
// d-793
// d-794
// d-795
// d-796
// d-797
// d-798
// d-799
// d-800
// d-801
// d-802
// d-803
// d-804
// d-805
// d-806
// d-807
// d-808
// d-809
// d-810
// d-811
// d-812
// d-813
// d-814
// d-815
// d-816
// d-817
// d-818
// d-819
// d-820
// d-821
// d-822
// d-823
// d-824
// d-825
// d-826
// d-827
// d-828
// d-829
// d-830
// d-831
// d-832
// d-833
// d-834
// d-835
// d-836
// d-837
// d-838
// d-839
// d-840
// d-841
// d-842
// d-843
// d-844
// d-845
// d-846
// d-847
// d-848
// d-849
// d-850
// d-851
// d-852
// d-853
// d-854
// d-855
// d-856
// d-857
// d-858
// d-859
// d-860
// d-861
// d-862
// d-863
// d-864
// d-865
// d-866
// d-867
// d-868
// d-869
// d-870
// d-871
// d-872
// d-873
// d-874
// d-875
// d-876
// d-877
// d-878
// d-879
// d-880
// d-881
// d-882
// d-883
// d-884
// d-885
// d-886
// d-887
// d-888
// d-889
// d-890
// d-891
// d-892
// d-893
// d-894
// d-895
// d-896
// d-897
// d-898
// d-899
// d-900
// d-901
// d-902
// d-903
// d-904
// d-905
// d-906
// d-907
// d-908
// d-909
// d-910
// d-911
// d-912
// d-913
// d-914
// d-915
// d-916
// d-917
// d-918
// d-919
// d-920
// d-921
// d-922
// d-923
// d-924
// d-925
// d-926
// d-927
// d-928
// d-929
// d-930
// d-931
// d-932
// d-933
// d-934
// d-935
// d-936
// d-937
// d-938
// d-939
// d-940
// d-941
// d-942
// d-943
// d-944
// d-945
// d-946
// d-947
// d-948
// d-949
// d-950
// d-951
// d-952
// d-953
// d-954
// d-955
// d-956
// d-957
// d-958
// d-959
// d-960
// d-961
// d-962
// d-963
// d-964
// d-965
// d-966
// d-967
// d-968
// d-969
// d-970
// d-971
// d-972
// d-973
// d-974
// d-975
// d-976
// d-977
// d-978
// d-979
// d-980
// d-981
// d-982
// d-983
// d-984
// d-985
// d-986
// d-987
// d-988
// d-989
// d-990
// d-991
// d-992
// d-993
// d-994
// d-995
// d-996
// d-997
// d-998
// d-999
// d-1000
// d-1001
// d-1002
// d-1003
// d-1004
// d-1005
// d-1006
// d-1007
// d-1008
// d-1009
// d-1010
// d-1011
// d-1012
// d-1013
// d-1014
// d-1015
// d-1016
// d-1017
// d-1018
// d-1019
// d-1020
// d-1021
// d-1022
// d-1023
// d-1024
// d-1025
// d-1026
// d-1027
// d-1028
// d-1029
// d-1030
// d-1031
// d-1032
// d-1033
// d-1034
// d-1035
// d-1036
// d-1037
// d-1038
// d-1039
// d-1040
// d-1041
// d-1042
// d-1043
// d-1044
// d-1045
// d-1046
// d-1047
// d-1048
// d-1049
// d-1050
// d-1051
// d-1052
// d-1053
// d-1054
// d-1055
// d-1056
// d-1057
// d-1058
// d-1059
// d-1060
// d-1061
// d-1062
// d-1063
// d-1064
// d-1065
// d-1066
// d-1067
// d-1068
// d-1069
// d-1070
// d-1071
// d-1072
// d-1073
// d-1074
// d-1075
// d-1076
// d-1077
// d-1078
// d-1079
// d-1080
// d-1081
// d-1082
// d-1083
// d-1084
// d-1085
// d-1086
// d-1087
// d-1088
// d-1089
// d-1090
// d-1091
// d-1092
// d-1093
// d-1094
// d-1095
// d-1096
// d-1097
// d-1098
// d-1099
// d-1100
// d-1101
// d-1102
// d-1103
// d-1104
// d-1105
// d-1106
// d-1107
// d-1108
// d-1109
// d-1110
// d-1111
// d-1112
// d-1113
// d-1114
// d-1115
// d-1116
// d-1117
// da-1
// da-2
// da-3
// da-4
// da-5
// da-6
// da-7
// da-8
// da-9
// da-10
// da-11
// da-12
// da-13
// da-14
// da-15
// da-16
// da-17
// da-18
// da-19
// da-20
// da-21
// da-22
// da-23
// da-24
// da-25
// da-26
// da-27
// da-28
// da-29
// da-30
// da-31
// da-32
// da-33
// da-34
// da-35
// da-36
// da-37
// da-38
// da-39
// da-40
// da-41
// da-42
// da-43
// da-44
// da-45
// da-46
// da-47
// da-48
// da-49
// da-50
// da-51
// da-52
// da-53
// da-54
// da-55
// da-56
// da-57
// da-58
// da-59
// da-60
// da-61
// da-62
// da-63
// da-64
// da-65
// da-66
// da-67
// da-68
// da-69
// da-70
// da-71
// da-72
// da-73
// da-74
// da-75
// da-76
// da-77
// da-78
// da-79
// da-80
// da-81
// da-82
// da-83
// da-84
// da-85
// da-86
// da-87
// da-88
// da-89
// da-90
// da-91
// da-92
// da-93
// da-94
// da-95
// da-96
// da-97
// da-98
// da-99
// da-100
// da-101
// da-102
// da-103
// da-104
// da-105
// da-106
// da-107
// da-108
// da-109
// da-110
// da-111
// da-112
// da-113
// da-114
// da-115
// da-116
// da-117
// da-118
// da-119
// da-120
// da-121
// da-122
// da-123
// da-124
// da-125
// da-126
// da-127
// da-128
// da-129
// da-130
// da-131
// da-132
// da-133
// da-134
// da-135
// da-136
// da-137
// da-138
// da-139
// da-140
// da-141
// da-142
// da-143
// da-144
// da-145
// da-146
// da-147
// da-148
// da-149
// da-150
// da-151
// da-152
// da-153
// da-154
// da-155
// da-156
// da-157
// da-158
// da-159
// da-160
// da-161
// da-162
// da-163
// da-164
// da-165
// da-166
// da-167
// da-168
// da-169
// da-170
// da-171
// da-172
// da-173
// da-174
// da-175
// da-176
// da-177
// da-178
// da-179
// da-180
// da-181
// da-182
// da-183
// da-184
// da-185
// da-186
// da-187
// da-188
// da-189
// da-190
// da-191
// da-192
// da-193
// da-194
// da-195
// da-196
// da-197
// da-198
// da-199
// da-200
// da-201
// da-202
// da-203
// da-204
// da-205
// da-206
// da-207
// da-208
// da-209
// da-210
// da-211
// da-212
// da-213
// da-214
// da-215
// da-216
// da-217
// da-218
// da-219
// da-220
// da-221
// da-222
// da-223
// da-224
// da-225
// da-226
// da-227
// da-228
// da-229
// da-230
// da-231
// da-232
// da-233
// da-234
// da-235
// da-236
// da-237
// da-238
// da-239
// da-240
// da-241
// da-242
// da-243
// da-244
// da-245
// da-246
// da-247
// da-248
// da-249
// da-250
// da-251
// da-252
// da-253
// da-254
// da-255
// da-256
// da-257
// da-258
// da-259
// da-260
// da-261
// da-262
// da-263
// da-264
// da-265
// da-266
// da-267
// da-268
// da-269
// da-270
// da-271
// da-272
// da-273
// da-274
// da-275
// da-276
// da-277
// da-278
// da-279
// da-280
// da-281
// da-282
// da-283
// da-284
// da-285
// da-286
// da-287
// da-288
// da-289
// da-290
// da-291
// da-292
// da-293
// da-294
// da-295
// da-296
// da-297
// da-298
// da-299
// da-300
// da-301
// da-302
// da-303
// da-304
// da-305
// da-306
// da-307
// da-308
// da-309
// da-310
// da-311
// da-312
// da-313
// da-314
// da-315
// da-316
// da-317
// da-318
// da-319
// da-320
// da-321
// da-322
// da-323
// da-324
// da-325
// da-326
// da-327
// da-328
// da-329
// da-330
// da-331
// da-332
// da-333
// da-334
// da-335
// da-336
// da-337
// da-338
// da-339
// da-340
// da-341
// da-342
// da-343
// da-344
// da-345
// da-346
// da-347
// da-348
// da-349
// da-350
// da-351
// da-352
// da-353
// da-354
// da-355
// da-356
// da-357
// da-358
// da-359
// da-360
// da-361
// da-362
// da-363
// da-364
// da-365
// da-366
// da-367
// da-368
// da-369
// da-370
// da-371
// da-372
// da-373
// da-374
// da-375
// da-376
// da-377
// da-378
// da-379
// da-380
// da-381
// da-382
// da-1
// da-2
// da-3
// da-4
// da-5
// da-6
// da-7
// da-8
// da-9
// da-10
// da-11
// da-12
// da-13
// da-14
// da-15
// da-16
// da-17
// da-18
// da-19
// da-20
// da-21
// da-22
// da-23
// da-24
// da-25
// da-26
// da-27
// da-28
// da-29
// da-30
// da-31
// da-32
// da-33
// da-34
// da-35
// da-36
// da-37
// da-38
// da-39
// da-40
// da-41
// da-42
// da-43
// da-44
// da-45
// da-46
// da-47
// da-48
// da-49
// da-50
// da-51
// da-52
// da-53
// da-54
// da-55
// da-56
// da-57
// da-58
// da-59
// da-60
// da-61
// da-62
// da-63
// da-64
// da-65
// da-66
// da-67
// da-68
// da-69
// da-70
// da-71
// da-72
// da-73
// da-74
// da-75
// da-76
// da-77
// da-78
// da-79
// da-80
// da-81
// da-82
// da-83
// da-84
// da-85
// da-86
// da-87
// da-88
// da-89
// da-90
// da-91
// da-92
// da-93
// da-94
// da-95
// da-96
// da-97
// da-98
// da-99
// da-100
// da-101
// da-102
// da-103
// da-104
// da-105
// da-106
// da-107
// da-108
// da-109
// da-110
// da-111
// da-112
// da-113
// da-114
// da-115
// da-116
// da-117
// da-118
// da-119
// da-120
// da-121
// da-122
// da-123
// da-124
// da-125
// da-126
// da-127
// da-128
// da-129
// da-130
// da-131
// da-132
// da-133
// da-134
// da-135
// da-136
// da-137
// da-138
// da-139
// da-140
// da-141
// da-142
// da-143
// da-144
// da-145
// da-146
// da-147
// da-148
// da-149
// da-150
// da-151
// da-152
// da-153
// da-154
// da-155
// da-156
// da-157
// da-158
// da-159
// da-160
// da-161
// da-162
// da-163
// da-164
// da-165
// da-166
// da-167
// da-168
// da-169
// da-170
// da-171
// da-172
// da-173
// da-174
// da-175
// da-176
// da-177
// da-178
// da-179
// da-180
// da-181
// da-182
// da-183
// da-184
// da-185
// da-186
// da-187
// da-188
// da-189
// da-190
// da-191
// da-192
// da-193
// da-194
// da-195
// da-196
// da-197
// da-198
// da-199
// da-200
// da-201
// da-202
// da-203
// da-204
// da-205
// da-206
// da-207
// da-208
// da-209
// da-210
// da-211
// da-212
// da-213
// da-214
// da-215
// da-216
// da-217
// da-218
// da-219
// da-220
// da-221
// da-222
// da-223
// da-224
// da-225
// da-226
// da-227
// da-228
// da-229
// da-230
// da-231
// da-232
// da-233
// da-234
// da-235
// da-236
// da-237
// da-238
// da-239
// da-240
// da-241
// da-242
// da-243
// da-244
// da-245
// da-246
// da-247
// da-248
// da-249
// da-250
// da-251
// da-252
// da-253
// da-254
// da-255
// da-256
// da-257
// da-258
// da-259
// da-260
// da-261
// da-262
// da-263
// da-264
// da-265
// da-266
// da-267
// da-268
// da-269
// da-270
// da-271
// da-272
// da-273
// da-274
// da-275
// da-276
// da-277
// da-278
// da-279
// da-280
// da-281
// da-282
// da-283
// da-284
// da-285
// da-286
// da-287
// da-288
// da-289
// da-290
// da-291
// da-292
// da-293
// da-294
// da-295
// da-296
// da-297
// da-298
// da-299
// da-300
// da-301
// da-302
// da-303
// da-304
// da-305
// da-306
// da-307
// da-308
// da-309
// da-310
// da-311
// da-312
// da-313
// da-314
// da-315
// da-316
// da-317
// da-318
// da-319
// da-320
// da-321
// da-322
// da-323
// da-324
// da-325
// da-326
// da-327
// da-328
// da-329
// da-330
// da-331
// da-332
// da-333
// da-334
// da-335
// da-336
// da-337
// da-338
// da-339
// da-340
