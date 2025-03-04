# RESCUE Frontend

## Initial Build

To run:

1. Clone the repository.
2. Run `npm install` - installs dependencies.
3. Run `npm run dev` - will give localhost link.

And that's it!

---

### **NOTE**
- This version is reading directly from a JSON file (located in the `public` folder).
- The full version reads from the Flask backend API (which is currently a little bugged but will be fixed soon).

---

## **Things of Note That Need to Be Added/Fixed**
- **Reading from API instead of JSON**.
- **Screen resizing looks a bit odd right now**.
- **⚠️ IMPORTANT: No "checks" for invalid topology.**
  - Right now, you can manually modify the JSON, but there are no safeguards for invalid topology values.
  - Example: You *shouldn't* have a **model parallel value of 3**, as it would result in unnecessary overhead communication between nodes.
  - Modify at your own risk until topology validation tests are added.
