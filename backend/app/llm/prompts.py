def get_source_code_analysis_prompt(content) -> str:
    prompt = \
    f"""
    Here is the file contents for you to analyze:

    {content}
    """

    return prompt

def get_question_answer_prompt(context_text: str, question: str) -> str:
    prompt = \
    f"""You are an expert codebase assistant.
    
    Based on the following retrieved text snippets, answer the user's question in detail. You must also generate a flowchart visualizing the question and answer in detail using Mermaid chart schema.

    Retrieved Code Snippets:
    {context_text}

    User Question:
    {question}

    Return the result in the following JSON format:

    {{
        "answer": <answer>,
        "flowchart" <mermaid schema>
    }}
    """ 
    return prompt

def get_repo_analysis_prompt(context: str) -> str:
    prompt = \
    f"""You are an expert codebase assistant.

    Based on the following retrieved GitHub repository information, provide an in-depth analysis of what you think the intention of the GitHub repository is. Your response should be professional, clean, and correct.

    GitHub Repository Information:
    {context}
    """
    return prompt
