{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    openspec = {
      url = "github:Fission-AI/OpenSpec";
      inputs.nixpkgs.follows = "nixpkgs";
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
            src = ./app;
            filter = name: _type: builtins.baseNameOf name != "node_modules";
          };

          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (finalAttrs) pname version src;
            fetcherVersion = 3;
            hash = "sha256-uoJEWZVETedEs/E82oA5FxOPTKeTEUT7g9/vEwKDUcc=";
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
        };
      }
    );
}
