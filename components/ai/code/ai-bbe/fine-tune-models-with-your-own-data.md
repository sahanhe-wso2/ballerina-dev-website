---
title: 'Fine-tune models with your own data to create your own models'
description: "OpenAI’s Fine Tuning API lets you create a model that understands your world. Use Ballerina’s ability to easily integrate to business APIs and systems to take your business data to fine-tune it and make that available for your business."
url: 'https://github.com/ballerina-guides/ai-samples/blob/main/finetune_openai_models/main.bal'
---
```
public function main() returns error? {
    finetunes:Client openaiFineTunes = check new ({auth: {token: openAIToken}});

    finetunes:CreateFileRequest fileRequest = {
        file: {
            fileContent: check io:fileReadBytes(TRAIN_DATA_FILE_PATH),
            fileName: TRAIN_DATA_FILE_NAME
        },
        purpose: "fine-tune"
    };
    finetunes:OpenAIFile fileResponse = check openaiFineTunes->/files.post(fileRequest);
    io:println(string `Training file uploaded successfully with ID: ${fileResponse.id}`);

    finetunes:CreateFineTuneRequest fineTuneRequest = {
        training_file: fileResponse.id,
        model: "ada",
        n_epochs: 4
    };
    finetunes:FineTune fineTuneResponse = 
        check openaiFineTunes->/fine\-tunes.post(fineTuneRequest);
    io:println(string `Fine-tune job started successfully with ID: ${
                       fineTuneResponse.id}`);
}
```