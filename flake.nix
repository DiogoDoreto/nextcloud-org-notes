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
                inAppDir = builtins.any (
                  dir: builtins.match (".*/" + dir + "(/.*)?") name != null
                ) appDirs;
              in
              inAppDir || builtins.elem (builtins.baseNameOf name) rootFiles;
          };

          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (finalAttrs) pname version src;
            fetcherVersion = 3;
            hash = "sha256-yiZvvNx85fIdmHU03k4U+U/vTAeaDXZEaXeh1rSnU1w=";
          };

          nativeBuildInputs = [
            pkgs.nodejs_22
            pkgs.pnpm
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
          buildInputs = with pkgs; [
            inputs.openspec.packages.${system}.default
            php84
            php84Packages.composer
            nodejs_22
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
