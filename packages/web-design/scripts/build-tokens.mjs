import StyleDictionary from 'style-dictionary';

register(StyleDictionary);

const sd = new StyleDictionary({
  source: ['../../../tokens.json'],
  platforms: {
    // TODO
  }
});

await sd.buildAllPlatforms();
