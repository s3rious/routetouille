import { createEffect } from "effector";

const fetchDashboard = createEffect({
  name: "dashboard/fetchDashboard",
  async handler() {
    // TODO: implement real dashboard fetch logic
    return null;
  },
});

export { fetchDashboard };
