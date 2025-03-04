Initial build for RESCUE frontend.

To run:

Clone repo.
Run "npm build" - installs dependencies
Run "npm start dev" - will give localhost link.

And that's it!

NOTE - this version is reading directly off of a json (located in public folder)
Full version reads from flask backend API (which worked but is a little bugged right now) - will be fixed soon.

Things of note that need to be added/fixed:

-Aforementioned reading from API instead of json.
-Screen resizing looks a bit odd right now.
-*IMPORTANT* - no "checks" for invalid topology.
  -So while you can go and modify the json directly, there's no code right now that tells if topology values are invalid (ex., you can't [or at least shouldn't] have a model parallel value of 3 - as it would result in overhead communication between nodes.)
  -Modify at your own risk until I add tests to ensure a topology is valid.
