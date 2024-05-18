// We can't hard-code this to something like "@@input@@" because
// rollup considers that to be dead code and eliminates it.
//
// Anyway, this will be replaced with a constant in builds.
export default process.env.BEYGLA_MODE as "names" | "addresses"; // Set to either 'names' or 'addresses' in builds
