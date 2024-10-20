<script>
  import Router, { location, link } from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import Navbar from "./routes/Navbar.svelte";
  import Codes from "./routes/codes/Codes.svelte";

  let routes = [
    {
      href: "/#",
      title: "Home"
    },
    {
      href: "#/codes",
      title: "Codes"
    },
    {
      href: "#/results",
      title: "Results"
    }
  ];
</script>

<body class="h-screen bg-gray-800">
  <div class="grid grid-cols-4">
    <div class="col-span-1">
      <Navbar {routes} />
    </div>
    <div class="col-span-4">
      <Router
        routes={{
          "/": Home,
          "/codes": Codes
        }}
      />
    </div>
  </div>
</body>
