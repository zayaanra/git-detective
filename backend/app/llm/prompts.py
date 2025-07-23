def get_source_code_analysis_prompt(filename: str, code: str) -> str:
    prompt = \
    f"""
    Here is the source code for you to analyze:

    Filename: {filename}
    --------------------

    Code:
    {code}
    """

    return prompt