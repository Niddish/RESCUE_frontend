# RESCUE Frontend

## Initial Build

To run:

1. Clone the repository.
2. Run `npm install` - installs dependencies.
3. *IMPORTANT* - add backend API link from flask.out output into the corresponding spot in App.jsx
4. Run `npm run dev` - will give localhost link.

And that's it!

## 💻 It Should Look Something Like This

![RESCUE UI Screenshot](RESCUE_frontend/src/assets/RESCUE_test.png)

## **Things of Note That Need to Be Added/Fixed**

- **Screen resizing looks a bit odd right now**.
- **Need to update certain components to use MUI instead of React native.**
  
- **⚠️ IMPORTANT: No "checks" for invalid topology.**
  - Right now, you can manually modify the JSON, but there are no safeguards for invalid topology values.
  - Example: You *shouldn't* have a **model parallel value of 3**, as it would result in unnecessary overhead communication between nodes.
  - Modify at your own risk until topology validation tests are added.
