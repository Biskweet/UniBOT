import discord
from discord.ext import commands

bot = commands.Bot(command_prefix='.')


@bot.event
async def on_ready():
    print('ready')


@bot.command()
async def text(ctx):
    embed = discord.Embed(title="titre", description="description", timestamp=__import__("datetime").datetime.now())
    embed.set_footer(text="footer")
    embed.set_author(name="author")
    await ctx.send(embed=embed)


# import io, asyncio
# from PIL import ImageGrab


browser = ""


def clean_window():
    to_delete = [".gm-fullscreen-control", "div[id=share]", "div[class=gmnoprint]", "div[class=gmnoprint]", "div[class='gmnoprint gm-style-cc']",
                 "div[class=gm-style-cc]", "div#controls", "div#map_canvas", "div#address", "div#minimaximize", "div#ad", "div#adnotice",
                 ".intro_splash", ".intro_splash", ".intro_splash", ".intro_splash", ".intro_splash"]
    for selector in to_delete:
        browser.execute_script(f"""document.querySelector("{selector}").remove();""")




def ():
    

bot.run("")  # Previous token revoked
