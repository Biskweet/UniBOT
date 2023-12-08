import discord
from discord import Embed
from discord.ext import commands
import requests as r
from PIL import ImageGrab
import pickle, asyncio, random, datetime, io
from keep_alive import keep_alive
from variables import (SU_hex, discord_channels, EIGHTBALL_ANSWERS, youtube_token,
                       tw_accounts, DSU_ID, icons, months_fr, headers, alphabet, wiki_locales)

intents = discord.Intents.all()
intents.members = True

client = commands.Bot(command_prefix="unibot ", help_command=None, intents=intents)


# ========== Non-async functions ==========
with open("auto_vars", "rb") as f:
    monitoring_data = pickle.load(f)


def save_vars(data):
    with open("auto_vars", "wb") as f:
        pickle.dump(data, f)


def make_embed(title=Embed.Empty, url=Embed.Empty, description=Embed.Empty, footer_text=Embed.Empty, footer_icon_url=Embed.Empty,
               author_title='', author_icon_url=Embed.Empty, color=SU_hex, media_url=Embed.Empty, thumbnail_url=Embed.Empty):
    embed = Embed(title=title, description=description, color=color, url=url)
    embed.set_author(name=author_title, icon_url=author_icon_url)
    embed.set_image(url=media_url)
    embed.set_footer(text=footer_text, icon_url=footer_icon_url)
    embed.set_thumbnail(url=thumbnail_url)
    return embed



def clean_window():
    to_delete = [".gm-fullscreen-control", "div[id=share]", "div[class=gmnoprint]", "div[class=gmnoprint]", "div[class='gmnoprint gm-style-cc']",
     "div[class=gm-style-cc]", "div#controls", "div#map_canvas", "div#address", "div#minimaximize", "div#ad", "div#adnotice",
     ".intro_splash", ".intro_splash", ".intro_splash", ".intro_splash", ".intro_splash"]
    for selector in to_delete:
        browser.execute_script(f"""document.querySelector("{selector}").remove();""")
        print(selector, "ok")


def hasquoi(msg):
    return ''.join([c for c in msg if c in alphabet]) == "quoi"
# =========================================


# ============ Event functions ============
@client.event
async def on_ready():
    print(client.user, "is ready.")


@client.event
async def on_message(message):
    if message.author != client.user:
        
        if f"<@!{client.user.id}>" in message.content:
            embed = make_embed(author_title = "C'est moi !",
                               description  = "Tapez `unibot help` pour obtenir la liste des commandes.")
            await message.channel.send(embed=embed)

        # elif hasquoi(msg) and message.channel.name not in ("modos-chat", "admin-chat"):
        #    await message.channel.send("feur")

   
    await client.process_commands(message)


@client.event
async def on_member_join(member):
    if member.guild.id == 498225252195762186:
        return

    channel = client.get_channel(discord_channels["join"])
    await channel.send(f"<@{member.id}> a rejoint le serveur **{member.guild.name}**.")

    commencez_ici = client.get_channel(discord_channels["commencez-ici"])
    ping = await commencez_ici.send(f"<@{member.id}> choisissez pour accéder au serveur !")
    await asyncio.sleep(0.3)
    await ping.delete()

    await update_member_count()



@client.event
async def on_member_remove(member):
    if member.guild.id == 498225252195762186:
        return

    channel = client.get_channel(discord_channels["leave"])
    await channel.send(f"{member.name}#{member.discriminator} a quitté le serveur.")
    await update_member_count()
# =========================================


# =========== Command functions ===========
@client.command(aliases=["aide", "commandes", "commands"])
async def help(ctx, command=''):
    footer = "Vous pouvez obtenir des informations sur une commande en tapant : unibot help [commande]"

    if command == '':
        title = "Liste des commandes"
        description = """
send_info
ping
8ball
wiki
couleur (VIP)
clear (modération)
kick (modération)
ban/unban (modération)
create_embed/edit_embed (modération)
"""
        return await ctx.send(embed=make_embed(author_title    = title,
                                               author_icon_url = "https://i.ibb.co/3fzsbFQ/Artboard-1-3x.png",
                                               description     = description,
                                               footer_text     = footer))


    elif command == "ping":
        title       = "Help :arrow_right: __ping__"
        description = "Renvoie la latence en millisecondes du bot " \
                      "(souvent utilisé pour vérifier sa présence en ligne)."

    elif command == "8ball":
        title       = "Help :arrow_right: __8ball__"
        description = "Envoie une réponse ~~tirée au hasard~~ à la question passée en paramètre.\n\n" \
                      "Exemple d'utilisation :\n`unibot 8ball Vais-je avoir une bonne note à mon partiel de grammaire ?`"
    
    elif command == "couleur":
        title       = "Help :arrow_right: __couleur__"
        description = "__**(Réservé aux membres boosters)**__\n" \
                      "Crée un rôle de couleur et l'assigne au membre selon la couleur passée en paramètre.\n\n" \
                      "Exemple d'utilisation :\n`unibot couleur 00FFE3`\n\n" \
                      "Vous pouvez trouver le code hexadécimal de la couleur de votre choix __**[ici](https://g.co/kgs/QLJzXN)**__"
    
    elif command == "clear":
        title       = "Help :arrow_right: __clear__"
        description = "__**(Réservé à la modération)**__\n" \
                      "Argument optionnel. Supprime les N derniers messages (sans compter celui de la commande). " \
                      "Par défaut 5 (maximum 75).\n\n" \
                      "Exemples d'utilisation :\n`unibot clear`\n`unibot clear 10`"

    elif command in ("kick", "ban"):
        title       = "Help :arrow_right: __kick__/__ban__"
        description = "__**(Réservé à la modération)**__\n" \
                      "Exclut/bannit le membre passé en paramètre. Motif optionnel.\n\n" \
                      "Exemple d'utilisation :\n`unibot ban @Exemple#1234`\n`unibot kick @Exemple#1234 motif`\n\n" \
                      "Note : il peut être difficile/impossible de mentionner correctement " \
                      "l'utilisateur. Pour ce faire, utiliser `<@IdDuMembre>`."

    elif command == "unban":
        title       = "Help :arrow_right: __unban__"
        description = "__**(Réservé à la modération)**__\n" \
                      "\"Débannit\" ou \"pardonne\" un membre banni.\n\n" \
                      "Exemple d'utilisation :\n`unibot unban @Exemple#1234`\n\n" \
                      "Note : il peut être difficile/impossible de mentionner correctement " \
                      "l'utilisateur. Pour ce faire, utiliser `<@IdDuMembre>`."

    elif command == "create_embed":
        title       = "Help :arrow_right: __create_embed__"
        description = "__**(Réservé à la modération)**__\n" \
                      "Crée un message de type `Discord.Embed` dont le titre est la phrase passée en paramètre. " \
                      "Pour ajouter une ou plusieurs descriptions, utiliser `edit_embed`.\n\n" \
                      "Exemple d'utilisation :\n`unibot create_embed Titre de mon embed`"

    elif command == "edit_embed":
        title       = "Help :arrow_right: __edit_embed__"
        description = "__**(Réservé à la modération)**__\n" \
                      "Prend en paramètre : l'ID du message, le type de modification à effectuer (add/remove), " \
                      "puis le contenu à ajouter en description. " \
                      "Chaque appel `add` pour un message ajoute sur une nouvelle ligne, tandis que `remove` " \
                      "supprime toute la description d'un Embed.\n\n" \
                      "Exemples d'utilisation :\n`unibot edit_embed 123456789012 add Ma description`\n`unibot edit_embed 123456789012 remove`"

    elif command == "wiki":
        title       = "Help :arrow_right: __wiki__"
        description = "Effectue une requête et renvoie l'introduction d'un article Wikipédia.\n" \
                      "Prend en paramètre la langue (requis, selon le formattage ICU, par exemple `en`, `fr`, `de`, etc.), et le titre de l'article (optionnel), cherche la correspondance la plus proche et renvoie " \
                      "l'introduction de celle-ci. Si aucun titre n'est fourni, renvoie un article choisi au hasard.\n\n" \
                      "Modèle d'utilisation : `unibot wiki [langue] [article]`.\n\n" \
                      "Exemple d'utilisation :\n`unibot wiki en` (article en anglais au hasard)\n`unibot wiki fr victor hugo` (article français sur Victor Hugo).\n\n" \
                      "Obtenir la [liste des langues disponibles](https://en.wikipedia.org/wiki/List_of_Wikipedias#Editions_overview)."
    
    else: return

    return await ctx.send(embed=make_embed(title       = title,
                                           description = description,
                                           footer_text = footer))


@client.command()
async def ping(ctx):
    await ctx.send(embed=make_embed(title=f"Pong ! :ping_pong:  {round(client.latency * 100)} millisecondes."))

"""
@client.command()
async def randomplace(ctx):
    img, address = await get_new_place()
    with io.BytesIO() as image_bin:
        img.save(image_bin, format='PNG')
        image_bin.seek(0)
        await ctx.send(address, file=discord.File(fp=image_bin, filename="random.png"))
"""

@client.command()
async def kick(ctx, member: discord.Member, *, reason=None):
    if ctx.author.guild_permissions.kick_members:
        await member.kick(reason=reason)

    else: await ctx.message.delete()


@client.command()
async def ban(ctx, member: discord.Member, *, reason=None):
    if ctx.author.guild_permissions.ban_members:
        await member.ban(reason=reason)

    else: await ctx.message.delete()


@client.command()
async def unban(ctx, member: discord.User):
    if ctx.author.guild_permissions.ban_members:
        await ctx.guild.unban(member)

    else: await ctx.message.delete()


@client.command(aliases=["8ball"])
async def _8ball(ctx, *, question=""):
    if not question:
        return await ctx.send(embed=make_embed(author_title="Pose la question qui te brûle."))

    await ctx.send(embed=make_embed(author_title = f"Question : {question}",
                                    description  = f"{random.choice(EIGHTBALL_ANSWERS)}."))


@client.command()
async def clear(ctx, amount="5"):
    if not ctx.author.guild_permissions.manage_messages:
        return
        # ====

    if amount == "0":
        return await ctx.send(embed=make_embed(author_title="Impossible de supprimer 0 message."))
        # ====

    try:
        amount = int(amount)
        if amount > 75:
            return await ctx.send("Restriction : impossible de supprimer autant de messages d'un coup.")
            # ==== 

        await ctx.channel.purge(limit=amount + 1)

    except Exception as e:
        embed = Embed(description = f"Je crois qu'il y a une erreur dans votre commande !\n"
                                    f"([Voir le type d'erreur](https://docs.python.org/3/library/exceptions.html#{type(e).__name__}))")
        await ctx.send(embed=embed)


@client.command()
async def send_info(ctx):
    embed = make_embed(description=f"channel: {ctx.channel}\nserver: {ctx.guild}\nuser: {ctx.message.author}")
    await ctx.send(embed=embed)


@client.command()
async def wiki(ctx, locale, *, title: str = ''):

    if locale not in wiki_locales:
        return await ctx.send(embed=make_embed(author_title="Langue incorrecte", description="Pour obtenir la liste des langues, [cliquez ici](https://en.wikipedia.org/wiki/List_of_Wikipedias#Editions_overview)."))

    
    if not title:
        req = r.get(f"https://{locale}.wikipedia.org/w/api.php?action=query&generator=random&prop=extracts"
                    "&grnlimit=1&grnnamespace=0&prop=extracts&explaintext=1&exintro=1&format=json").json()
        key = list(req["query"]["pages"].keys())[0]
        content = req["query"]["pages"][key]
        link = f"https://{locale}.wikipedia.org/wiki/" + content["title"].replace(' ', '_')
        text = content["extract"]

        if len(text) > 2000:
            text = text[:2000] + "..."

        text += f"\n\n[Ouvrir]({link})"

        await ctx.send(embed=make_embed(author_title    = content["title"],
                                        author_icon_url = icons["wiki"],
                                        description     = text))

    else:
        title = title.replace(' ', '_')
        search, articles, _, link = r.get(f"https://{locale}.wikipedia.org/w/api.php?action=opensearch&limit=1&search=" + title).json()
        if articles:
            article = r.get(f"https://{locale}.wikipedia.org/w/api.php?format=json&action=query&"
                            f"prop=extracts&exintro=1&explaintext=1&titles={articles[0].replace(' ', '_')}").json()
            key = list(article["query"]["pages"].keys())[0]
            text = article["query"]["pages"][key]["extract"]
            if not text:
                return await ctx.send(embed=make_embed(author_title="Veuillez founir un titre plus précis."))

            if len(text) > 2000:
                text = text[:2000] + "..."

            text += f"\n\n[Ouvrir]({link[0]})"
            await ctx.send(embed=make_embed(author_title    = articles[0],
                                            author_icon_url = icons["wiki"],
                                            description     = text, ))

        else:
            await ctx.send(embed=make_embed(author_title="Article introuvable"))


@client.command()
async def couleur(ctx, *, hexcode: str = ''):
    if "Booster" not in [role.name for role in ctx.author.roles]:
        return
    
    if not hexcode:
        return await help(ctx, command="couleur")

    if hexcode[0] == '#':
        hexcode = hexcode[1:]

    try:
        int(hexcode, 16)

    except Exception:
        return await help(ctx, command="couleur")

    # == Wrong user input ==
    if len(hexcode) < 6:
        return await ctx.send(embed=make_embed(author_title=f"Votre code hexadécimal est trop petit ! ({len(hexcode)} < 6)"))
    elif len(hexcode) > 6:
        return await ctx.send(embed=make_embed(author_title=f"Votre code hexadécimal est trop long ! ({len(hexcode)} > 6)"))
    # ======================

    new_role = discord.utils.get(ctx.guild.roles, name="VIP " + hexcode)

    if not new_role:
        loading_msg = await ctx.send("Création du rôle, veuillez patienter... <a:discordloading:873989182668800001>")
        new_role = await ctx.guild.create_role(name   = "VIP " + hexcode,
                                               colour = int(hexcode, 16))
        await new_role.edit(position=len(ctx.guild.roles) - 17)
        await loading_msg.delete()

    await ctx.author.add_roles(new_role)

    embed = make_embed(title         = "Rôle ajouté !",
                       thumbnail_url = f"https://singlecolorimage.com/get/{hexcode}/100x75",
                       description   = f"{ctx.author.mention}, je viens de vous assigner le rôle {new_role.mention} !",
                       footer_text   = "Il peut arriver que votre rôle soit mal hiérarchisé. Si tel est le cas, contactez un modérateur !")
    
    await ctx.send(embed=embed)    


@client.command()
async def delete_role(ctx, role: discord.Role = None):
    if not ctx.author.guild_permissions.manage_roles:
        return

    if not role:
        await ctx.send(embed=make_embed(title="Erreur d'argument"))

    await role.delete()
    await ctx.send(embed=make_embed(title="Rôle supprimé"))


@client.command()
async def create_embed(ctx, *, title):
    modo = discord.utils.get(ctx.guild.roles, name="modérateur")
    if modo:
        await ctx.send(embed=make_embed(title=title))


@client.command()
async def edit_embed(ctx, msg_id, modification, *, content=""):
    modo = discord.utils.get(ctx.guild.roles, name="modérateur")
    if not modo:
        return

    old = await ctx.fetch_message(msg_id)

    if modification == "add":
        if not content:
            return await ctx.send("Vous devez spécifier du contenu à ajouter.")
            # ====

        description = old.embeds[0].description
        if description:
            description = description + "\n" + content
        else:
            description = content
      
    elif modification == "remove":
        description = ''
    
    await old.edit(embed=make_embed(title=old.embeds[0].title, description=description))
# =========================================


# ========= Simple Async functions ========
async def get_new_place():
    browser.get("https://randomstreetview.com/")
    address = browser.find_element_by_css_selector("div#address").text
    clean_window()
    await asyncio.sleep(0.05)
    #pyautogui.scroll(-2)
    screenshot = ImageGrab.grab()
    return screenshot, address


async def retrieve_videos(channel):
    res = r.get(f"https://www.googleapis.com/youtube/v3/search?key={youtube_token}"
                f"&channelId={monitoring_data['youtube']['account']}&part=snippet,id&order=date&maxResults=1").json()

    if not res.get("items"):
        return
        # ====

    new_video_id = res["items"][0]["id"]["videoId"]

    if new_video_id != monitoring_data["youtube"]["last_video_id"]:
        await channel.send("Nouvelle vidéo de Sorbonne Université !\n"
                           "https://www.youtube.com/watch?v=" + new_video_id)

        monitoring_data["youtube"]["last_video_id"] = new_video_id
        save_vars(monitoring_data)


async def retrieve_tweets(account: str, channel):
    # Getting last 10 tweets
    new_tweets = r.get("https://api.twitter.com/2/users/" + monitoring_data["twitter"][account]["twitter_account"] + "/tweets", headers=headers).json()
    new_tweet_id = new_tweets["data"][0]["id"]

    if (new_tweet_id != monitoring_data["twitter"][account]["last_tweet_id"]):

        tweet_data = r.get("https://api.twitter.com/2/tweets?ids=" + new_tweet_id + "&expansions=attachments.media_keys"
                           "&media.fields=preview_image_url,type,url&tweet.fields=referenced_tweets,created_at", headers=headers)
        tweet_data = tweet_data.json()

        if tweet_data["data"][0].get("referenced_tweets") and tweet_data["data"][0]["referenced_tweets"][0]["type"] in ("replied_to", "retweeted"):
            return  # Break case if tweet is a reply or a RT

        medias = None
        if tweet_data.get("includes"):
            medias = [tweet_data["includes"]["media"][i]["url"] if tweet_data["includes"]["media"][i]["type"] == "photo"
                      else tweet_data["includes"]["media"][i]["preview_image_url"] if tweet_data["includes"]["media"][i]["type"] == "video"
                      else Embed.Empty for i in range(len(tweet_data["includes"]["media"]))]

        date = tweet_data["data"][0]["created_at"][:-1]
        date = datetime.datetime.fromisoformat(date) + datetime.timedelta(hours=4)

        user = r.get("https://api.twitter.com/2/users?ids=" + monitoring_data["twitter"][account]["twitter_account"],
                     headers=headers).json()["data"][0]

        text = new_tweets["data"][0]["text"].replace('_', '\_') + f"\n\n__[Ouvrir](https://twitter.com/{user['username']}/status/{new_tweet_id})__"

        embed = make_embed(description     = text,
                           color           = int(0x1da1f2),
                           author_title    = f"{user['name']} (@{user['username']}) a tweeté :",
                           author_icon_url = monitoring_data["twitter"][account]["icon_url"],
                           media_url       = medias[0] if medias else Embed.Empty,
                           footer_text     = f"Le {date.day} {months_fr[date.month - 1]} {date.year} à {date.hour}:{str(date.minute).zfill(2)}",
                           footer_icon_url = icons["twitter"])

        await channel.send(embed=embed)

        monitoring_data["twitter"][account]["last_tweet_id"] = new_tweet_id
        save_vars(monitoring_data)


async def check_social_medias():
    await client.wait_until_ready()
    while "bot is running":
        for tw_account in tw_accounts:
            await retrieve_tweets(tw_account, client.get_channel(discord_channels["twitter"]))

        await retrieve_videos(client.get_channel(discord_channels["youtube"]))

        await asyncio.sleep(200)


async def update_member_count():
    member_count = len([m for m in client.get_guild(DSU_ID).members if not m.bot])
    await client.change_presence(activity=discord.Activity(type = discord.ActivityType.watching,
                                                           name = f"{member_count} étudiants sur le serveur !"))
# =========================================


# ================= Run ==================
keep_alive()
client.loop.create_task(check_social_medias())
client.run(__import__("os").environ["discord_token"])

