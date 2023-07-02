import codecs

def save_words_to_js(word_lists, output_dir):
    for length, words in word_lists.items():
        output_file = f'{output_dir}/words_{length}_letters.js'
        with codecs.open(output_file, 'w', encoding='utf-8') as file:
            file.write(f'const words = {words};')

def extract_words_by_length(dictionary_file, output_dir, lengths):
    word_lists = {length: [] for length in lengths}  # Create an empty list for each length

    with codecs.open(dictionary_file, 'r', encoding='utf-8') as file:
        for word in file:
            word = word.strip()
            word_length = len(word)
            if word_length in lengths:
                word_lists[word_length].append(word)

    save_words_to_js(word_lists, output_dir)

# Example usage
dictionary_file = 'Serbian.txt'  # Path to your dictionary file
output_dir = 'js_output'  # Path to output directory for JavaScript files
lengths = [5, 6, 7, 8]  # Specify the desired word lengths

extract_words_by_length(dictionary_file, output_dir, lengths)