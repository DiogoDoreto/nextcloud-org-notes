{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    openspec = {
      url = "github:Fission-AI/OpenSpec";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nextcloud-vue = {
      url = "github:nextcloud-libraries/nextcloud-vue";
      flake = false;
    };
  };
  outputs =
    { nixpkgs, utils, ... }@inputs:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        nodejs = pkgs.nodejs_24;
        pnpm = pkgs.pnpm.override { nodejs-slim = nodejs; };
        openspec = inputs.openspec.packages.${system}.default.overrideAttrs (oldAttrs: {
          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (oldAttrs) pname version src;
            inherit pnpm;
            fetcherVersion = 4;
            hash = "sha256-HuVltL2c+acN1KHDSRD1lZu+Rn92jO7yp1np1g0oQRw=";
          };
          nativeBuildInputs = [
            nodejs
            pkgs.npmHooks.npmInstallHook
            pkgs.pnpmConfigHook
            pnpm
          ];
        });
      in
      {
        packages.default = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "orgnotes";
          version = "0.1.0";
          src = pkgs.lib.cleanSourceWith {
            src = ./.;
            filter =
              name: _type:
              let
                appDirs = [
                  "appinfo"
                  "css"
                  "img"
                  "js"
                  "lib"
                  "src"
                  "templates"
                ];
                rootFiles = [
                  "composer.json"
                  "package.json"
                  "pnpm-lock.yaml"
                  "vite.config.js"
                  "vite.config.app.js"
                  "vite.config.personal-settings.js"
                  "eslint.config.js"
                ];
                inAppDir = builtins.any (dir: builtins.match (".*/" + dir + "(/.*)?") name != null) appDirs;
              in
              inAppDir || builtins.elem (builtins.baseNameOf name) rootFiles;
          };

          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (finalAttrs) pname version src;
            inherit pnpm;
            fetcherVersion = 4;
            hash = "sha256-c0aJKo8p4rhXua1K5Hi6rgSrqfY4ZmafxATGXMfc15c=";
          };

          nativeBuildInputs = [
            nodejs
            pnpm
            pkgs.pnpmConfigHook
          ];

          buildPhase = ''
            runHook preBuild
            pnpm run build
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r appinfo lib templates js css img $out/
            runHook postInstall
          '';
        });

        devShell = pkgs.mkShell {
          buildInputs = [
            openspec
            pkgs.php84
            pkgs.php84Packages.composer
            nodejs
            pnpm
          ];
          shellHook = ''
            mkdir -p deps
            rm deps/nextcloud-vue
            ln -sfn ${inputs.nextcloud-vue} deps/nextcloud-vue
          '';
        };
      }
    );
}
