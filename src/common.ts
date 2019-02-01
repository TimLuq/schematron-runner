
export interface IValidateOptions {
    /**
     * This determines whether or not warnings should be tested and returned.
     * Defaults to false.
     */
    excludeWarnings?: boolean;

    /**
     * The path to a directory containing resource files (eg. voc.xml) which may be necessary for some schematron tests.
     * Defaults to './', the current directory.
     */
    resourceDir: string;

    /**
     * An integer, which is the maximum length of the xml field in validation results.
     * Defaults to 200. Set to 0 for unlimited length.
     */
    xmlSnippetMaxLength: number;

    /**
     * A constructor function for a DOMParser.
     */
    DOMParser: PromiseLike<{ new(): DOMParser; }> | { new(): DOMParser; };

    /**
     * A hash function used for creating keys for caching of resources.
     */
    hashFunction: PromiseLike<(data: string) => PromiseLike<string>>
        | ((data: string) => PromiseLike<string>);

    /**
     * Function used to load a document from the filesystem.
     *
     * @param {object} options an inherited reference to a complete `IValidateOptions` object
     * @param {string} path the file system path to load
     * @returns {Promise<Document>}
     */
    loadXMLFile(options: IValidateOptions, path: string): PromiseLike<Document>;

    /**
     * Function used to load a document from an url.
     *
     * @param {object} options an inherited reference to a complete `IValidateOptions` object
     * @param {string} url the URL where the document is located
     * @returns {Promise<Document>}
     */
    loadXMLUrl(options: IValidateOptions, url: string): PromiseLike<Document>;

    /**
     * Called by `fn:error()`.
     *
     * @param {string} code the error code, empty is eq `FOER0000`
     * @param {?string} description text description of the error
     * @param {?object} errorObject any object passed from the function call
     */
    callbackError?(code: string | null, description?: string, errorObject?: any): void;

    /**
     * Called by `fn:trace()`.
     *
     * @param {object} value some value to be traced
     * @param {?string} label label for the trace
     */
    callbackTrace?(value: any, label?: string): void;
}
