import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    platform: { type: String, enum: ['youtube', 'instagram', 'other'], default: 'other' },
    kind: { type: String, enum: ['short', 'video', 'reel', 'post', 'link'], default: 'link' },
    // YouTube video id / Instagram shortcode — used for embeds and thumbnails.
    externalId: { type: String, trim: true },
    title: { type: String, trim: true },
    caption: { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
    // 'auto' = synced from the NGO's YouTube feed, 'manual' = added by an admin.
    source: { type: String, enum: ['auto', 'manual'], default: 'manual' },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// One copy of every auto-synced video, even if two instances sync at once.
postSchema.index({ source: 1, externalId: 1 }, { unique: true, sparse: true });
postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);
