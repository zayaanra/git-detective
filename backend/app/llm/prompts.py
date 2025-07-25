def get_source_code_analysis_prompt(content) -> str:
    prompt = \
    f"""
    Here is the file contents for you to analyze:

    {content}
    """

    return prompt