import { randomUUID } from 'node:crypto';

function stamp() {
  return new Date().toISOString();
}

/**
 * In-memory data store used when MongoDB is not reachable (DEMO mode).
 * Implements the same interface as the MongoDB store in ./mongo.js so the
 * API layer never needs to know which backend is active.
 */
export default function createMemoryStore() {
  // Starts EMPTY — demo content is never auto-inserted. The NGO manages real
  // content through the admin panel, exactly like the MongoDB store.
  const requirements = [];
  const activities = [];
  const volunteers = [];
  const enquiries = [];
  const posts = [];

  const findById = (list, id) => list.findIndex((item) => item.id === id);

  return {
    /* ------------------------------ requirements ----------------------------- */
    async listRequirements() {
      return [...requirements].reverse();
    },
    async createRequirement(data) {
      const item = { id: randomUUID(), ...data, createdAt: stamp(), updatedAt: stamp() };
      requirements.push(item);
      return item;
    },
    async updateRequirement(id, patch) {
      const i = findById(requirements, id);
      if (i === -1) return null;
      requirements[i] = { ...requirements[i], ...patch, updatedAt: stamp() };
      return requirements[i];
    },
    async removeRequirement(id) {
      const i = findById(requirements, id);
      if (i === -1) return false;
      requirements.splice(i, 1);
      return true;
    },

    /* ------------------------------- activities ------------------------------ */
    async listActivities() {
      return [...activities].reverse();
    },
    async createActivity(data) {
      const item = { id: randomUUID(), ...data, createdAt: stamp(), updatedAt: stamp() };
      activities.push(item);
      return item;
    },
    async updateActivity(id, patch) {
      const i = findById(activities, id);
      if (i === -1) return null;
      activities[i] = { ...activities[i], ...patch, updatedAt: stamp() };
      return activities[i];
    },
    async removeActivity(id) {
      const i = findById(activities, id);
      if (i === -1) return false;
      activities.splice(i, 1);
      return true;
    },

    /* ------------------------------- volunteers ------------------------------ */
    async listVolunteers() {
      return [...volunteers].reverse();
    },
    async createVolunteer(data) {
      const item = { id: randomUUID(), ...data, createdAt: stamp(), updatedAt: stamp() };
      volunteers.push(item);
      return item;
    },
    async removeVolunteer(id) {
      const i = findById(volunteers, id);
      if (i === -1) return false;
      volunteers.splice(i, 1);
      return true;
    },

    /* --------------------------------- stats -------------------------------- */
    async stats() {
      return {
        volunteers: volunteers.length,
        requirements: requirements.length,
        activities: activities.length,
        enquiries: enquiries.length,
      };
    },

    /* -------------------------------- enquiries ------------------------------ */
    async listEnquiries() {
      return [...enquiries].reverse();
    },
    async createEnquiry(data) {
      const item = {
        id: randomUUID(),
        status: 'new',
        ...data,
        createdAt: stamp(),
        updatedAt: stamp(),
      };
      enquiries.push(item);
      return item;
    },
    async updateEnquiry(id, patch) {
      const i = findById(enquiries, id);
      if (i === -1) return null;
      enquiries[i] = { ...enquiries[i], ...patch, updatedAt: stamp() };
      return enquiries[i];
    },
    async removeEnquiry(id) {
      const i = findById(enquiries, id);
      if (i === -1) return false;
      enquiries.splice(i, 1);
      return true;
    },

    /* ---------------------------------- posts --------------------------------- */
    async listPosts({ limit = 24 } = {}) {
      return posts.slice(0, limit);
    },

    async createPost(data) {
      const item = { id: randomUUID(), source: 'manual', ...data, createdAt: stamp(), updatedAt: stamp() };
      posts.push(item);
      return item;
    },

    async upsertAutoPost(data) {
      const i = posts.findIndex((p) => p.source === 'auto' && p.externalId === data.externalId);
      if (i !== -1) return null;
      const item = { id: randomUUID(), source: 'auto', ...data, createdAt: stamp(), updatedAt: stamp() };
      posts.push(item);
      return item;
    },

    async removePost(id) {
      const i = findById(posts, id);
      if (i === -1) return false;
      posts.splice(i, 1);
      return true;
    },
  };
}