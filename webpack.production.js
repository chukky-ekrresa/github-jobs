const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCSSExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
					'postcss-loader',
					'sass-loader',
				],
			},
		],
	},
	plugins: [new MiniCSSExtractPlugin()],
	devtool: 'source-map',
};
