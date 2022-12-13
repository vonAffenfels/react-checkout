// const withTM = require("next-transpile-modules")("./components");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, {dev, isServer, defaultLoaders, nextRuntime, webpack}) => {
        return config;
    }
};

module.exports = nextConfig;
