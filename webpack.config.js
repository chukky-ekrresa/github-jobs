const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');

const webpackDevConfig = require('./webpack.development');
const webpackProdConfig = require('./webpack.production');

module.exports = ({ mode }) => {
	return merge(
		{
			mode,
			entry: { app: './src/app.js', job: './src/job/job.js' },
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								plugins: [
									'@babel/plugin-proposal-object-rest-spread',
									'@babel/plugin-transform-runtime',
								],
								cacheDirectory: true,
							},
						},
					},
					{
						test: /\.(png|jpe?g|gif)$/i,
						use: [
							{
								loader: 'file-loader',
							},
						],
					},
					{
						test: /\.svg$/,
						use: { loader: 'svg-url-loader', options: { limit: 1000 } },
					},
				],
			},
			plugins: [
				new CleanWebpackPlugin(),
				new webpack.ProgressPlugin(),
				new HtmlWebpackInlineSVGPlugin({
					runPreEmit: true,
					svgoConfig: [
						{
							removeViewBox: false,
						},
					],
				}),
				new HtmlWebpackPlugin({
					title: 'GitHub Jobs App',
					template: './src/index.html',
					chunks: ['app'],
				}),
				new HtmlWebpackPlugin({
					filename: 'job.html',
					template: './src/job/job.html',
					chunks: ['job'],
				}),
				new CopyWebpackPlugin([{ from: './src/assets/', to: 'assets/' }]),
			],
			output: {
				filename: '[name].bundle.js',
				path: path.resolve(__dirname, 'dist'),
			},
		},
		resolveModeConfig({ mode })
	);
};

const resolveModeConfig = ({ mode }) => {
	switch (mode) {
		case 'development':
			return webpackDevConfig;
		case 'production':
			return webpackProdConfig;
		default:
			throw new Error('invalid webpack env');
	}
};
