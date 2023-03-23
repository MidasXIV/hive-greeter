import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const DISCORD_TOKEN = process.env['token'];
export const CLIENT_ID = process.env['clientId'];
export const GUILD_ID = process.env['guildId'];

if (!DISCORD_TOKEN) {
	console.error('No \'discord token\' provided in .env file.');
}
