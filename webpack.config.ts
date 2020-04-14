import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
	mode: "development",
	devtool: "inline-source-map",
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.bundle.js'
	},
	devServer: {
		writeToDisk: true,
		contentBase: __dirname
	}
};

export default config;