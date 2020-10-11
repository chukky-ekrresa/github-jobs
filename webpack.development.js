const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
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
	plugins: [],
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000,
	},
};
