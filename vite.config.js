import replace from "@rollup/plugin-replace";

export default {
  plugins: [
    replace({
      "process.env.REACT_APP_GOOGLE_MAPS_API_KEY": JSON.stringify(process.env.REACT_APP_GOOGLE_MAPS_API_KEY),
      preventAssignment: true, // Add this line
    }),
  ],
};
