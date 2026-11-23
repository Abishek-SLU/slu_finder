# slu_finder
## Web routing

The web app uses Expo single-page output (`web.output: "single"`) to avoid the SDK 58 development static-renderer unknown-module error on direct route requests. Authentication is restored in the browser before protected screens mount. Spring Boot remains responsible for JWT signature validation and API authorization.

When hosting the web export, configure a fallback rewrite for app routes to `/index.html` (preserving asset and API requests). This is needed for refreshing or directly opening paths such as `/student-home`. Native builds are unaffected.
