// pages/_app.js

import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
