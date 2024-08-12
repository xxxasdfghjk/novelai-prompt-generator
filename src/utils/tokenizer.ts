import * as fs from 'fs'
import * as zlib from 'zlib'
import * as iconv from 'iconv-lite'
import * as _ from 'lodash'

function bytesToUnicode(): { [key: number]: string } {
  const bs = Array.from({ length: 33 }, (_, i) => i + 33) // 33-126
    .concat(Array.from({ length: 15 }, (_, i) => i + 161)) // 161-176
    .concat(Array.from({ length: 39 }, (_, i) => i + 174)) // 174-213
  const cs = [...bs]
  let n = 0
  for (let b = 0; b < 256; b++) {
    if (!bs.includes(b)) {
      bs.push(b)
      cs.push(256 + n)
      n++
    }
  }
  return _.zipObject(
    bs,
    cs.map((n) => String.fromCharCode(n))
  ) as { [key: number]: string }
}

function getPairs(word: string[]): Set<[string, string]> {
  const pairs = new Set<[string, string]>()
  for (let i = 0; i < word.length - 1; i++) {
    pairs.add([word[i], word[i + 1]])
  }
  return pairs
}

function basicClean(text: string): string {
  return text
    .replace(/[\u{0080}-\u{FFFF}]/gu, '') // Remove non-printable characters
    .replace(/&[a-z]+;/g, '') // Remove HTML entities
    .trim()
}

function whitespaceClean(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

export class SimpleTokenizer {
  private byteEncoder: { [key: number]: string }
  private byteDecoder: { [key: string]: number }
  private encoder: { [key: string]: number }
  private decoder: { [key: number]: string }
  private bpeRanks: { [key: string]: number }
  private cache: { [key: string]: string }
  private pat: RegExp

  constructor() {
    this.byteEncoder = bytesToUnicode()
    this.byteDecoder = _.invert(this.byteEncoder) as { [key: string]: number }

    // Read and parse BPE merges
    const fileContent = fs.readFileSync(process.env.TOKENIZER_MODEL_PATH!)
    const decompressed = zlib.gunzipSync(fileContent)
    const merges = iconv
      .decode(decompressed, 'utf-8')
      .split('\n')
      .slice(1, 49152 - 256 - 2 + 1)
    const mergePairs = merges.map((line) => line.split(' '))

    // Build vocab
    let vocab = Object.values(this.byteEncoder)
    vocab = vocab.concat(vocab.map((v) => v + '</w>'))
    mergePairs.forEach((pair) => vocab.push(pair.join('')))
    vocab = vocab.concat(['', ''])

    this.encoder = _.zipObject(vocab, _.range(vocab.length)) as {
      [key: string]: number
    }
    this.decoder = _.invert(this.encoder) as { [key: number]: string }
    this.bpeRanks = _.zipObject(
      mergePairs.map((pair) => pair.join('')),
      _.range(mergePairs.length)
    ) as { [key: string]: number }
    this.cache = {
      '': '',
      '</w>': ''
    }
    this.pat =
      /<\|startoftext\|>|<\|endoftext\|>|'s|'t|'re|'ve|'m|'ll|'d|[\p{L}]+|[\p{N}]|[^\s\p{L}\p{N}]+/gu
  }

  bpe(token: string): string {
    if (this.cache[token]) return this.cache[token]
    let word = token.slice(0, -1) + token[token.length - 1] + '</w>'
    let pairs = getPairs(word.split(''))

    if (!pairs.size) return token + '</w>'

    while (true) {
      const bigram = _.minBy(
        [...pairs],
        (pair) => this.bpeRanks[pair.join('')] || Infinity
      )
      if (!bigram || !this.bpeRanks[bigram.join('')]) break

      const [first, second] = bigram
      let newWord: string[] = []
      let i = 0
      while (i < word.length) {
        const j = word.indexOf(first, i)
        if (j === -1) {
          newWord = newWord.concat(word.slice(i).split(''))
          break
        }
        newWord = newWord.concat(word.slice(i, j).split(''))
        i = j

        if (
          i < word.length - 1 &&
          word[i] === first &&
          word[i + 1] === second
        ) {
          newWord.push(first + second)
          i += 2
        } else {
          newWord.push(word[i])
          i += 1
        }
      }
      word = newWord.join('')
      pairs = getPairs(word.split(''))
      if (newWord.length === 1) break
    }
    this.cache[token] = word
    return word
  }

  encode(text: string): number[] {
    let bpeTokens: number[] = []
    text = whitespaceClean(basicClean(text)).toLowerCase()
    for (let token of text.match(this.pat) || []) {
      token = Array.from(
        token,
        (char) => this.byteEncoder[char.charCodeAt(0)]
      ).join('')
      bpeTokens = bpeTokens.concat(
        this.bpe(token)
          .split(' ')
          .map((bpeToken) => this.encoder[bpeToken])
      )
    }
    return bpeTokens
  }

  decode(tokens: number[]): string {
    const text = tokens.map((token) => this.decoder[token] || '').join('')
    return Array.from(text, (char) => this.byteDecoder[char.charCodeAt(0)])
      .join('')
      .replace('</w>', ' ')
  }
}

export const tokenizer = new SimpleTokenizer()
