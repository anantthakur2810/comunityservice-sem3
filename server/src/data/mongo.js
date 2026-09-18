import Requirement from '../models/Requirement.js';
import Volunteer from '../models/Volunteer.js';
import Enquiry from '../models/Enquiry.js';
import Post from '../models/Post.js';

const serialize = (doc) =>
  doc.toObject({
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  });

/**
 * MongoDB-backed data store. Implements the same interface as ./memory.js so
 * the API layer never needs to know which backend is active.
 */
export default function createMongoStore() {
  return {
    /* ------------------------------ requirements ----------------------------- */
    async listRequirements() {
      return (await Requirement.find().sort({ createdAt: -1 })).map(serialize);
    },
    async createRequirement(data) {
      return serialize(await Requirement.create(data));
    },
    async updateRequirement(id, patch) {
      const doc = await Requirement.findByIdAndUpdate(id, patch, { new: true });
      return doc ? serialize(doc) : null;
    },
    async removeRequirement(id) {
      const doc = await Requirement.findByIdAndDelete(id);
      return Boolean(doc);
    },

    /* ------------------------------- volunteers ------------------------------ */
    async listVolunteers() {
      return (await Volunteer.find().sort({ createdAt: -1 })).map(serialize);
    },
    async createVolunteer(data) {
      return serialize(await Volunteer.create(data));
    },
    async removeVolunteer(id) {
      const doc = await Volunteer.findByIdAndDelete(id);
      return Boolean(doc);
    },

    /* --------------------------------- stats -------------------------------- */
    async stats() {
      const [volunteers, requirements, enquiries] = await Promise.all([
        Volunteer.countDocuments(),
        Requirement.countDocuments(),
        Enquiry.countDocuments(),
      ]);
      return { volunteers, requirements, enquiries };
    },

    /* -------------------------------- enquiries ------------------------------ */
    async listEnquiries() {
      return (await Enquiry.find().sort({ createdAt: -1 })).map(serialize);
    },
    async createEnquiry(data) {
      return serialize(await Enquiry.create(data));
    },
    async updateEnquiry(id, patch) {
      const doc = await Enquiry.findByIdAndUpdate(id, patch, { new: true });
      return doc ? serialize(doc) : null;
    },
    async removeEnquiry(id) {
      const doc = await Enquiry.findByIdAndDelete(id);
      return Boolean(doc);
    },

    /* ---------------------------------- posts --------------------------------- */
    async listPosts({ limit = 24 } = {}) {
      return (await Post.find().sort({ publishedAt: -1, createdAt: -1 }).limit(limit)).map(serialize);
    },

    async createPost(data) {
      return serialize(await Post.create(data));
    },

    /** Insert-only: returns the doc for a new video, or null when it exists. */
    async upsertAutoPost(data) {
      const doc = await Post.findOneAndUpdate(
        { source: 'auto', externalId: data.externalId },
        { $setOnInsert: { ...data, source: 'auto' } },
        { new: true, upsert: true }
      );
      // Distinguish "was inserted" from "already existed" (duplicate-key race).
      return doc.createdAt.getTime() === doc.updatedAt.getTime() ? serialize(doc) : null;
    },

    async removePost(id) {
      const doc = await Post.findByIdAndDelete(id);
      return Boolean(doc);
    },
  };
}