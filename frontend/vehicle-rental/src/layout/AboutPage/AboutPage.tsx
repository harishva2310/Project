import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { SpinnerLoading } from '../../util/SpinnerLoading';

const AboutPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [about, setAbout] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setQuestion(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('question', question);
        try {
            setLoading(true);
            const response = await axios.post('/api/help/generate-content', formData);
            console.log(response.data);
            
            setAnswer(response.data);
        } catch (error) {
            console.error('Error sending question:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section data-bs-version="5.1" className="form5 cid-sFzDs3t9EG" id="form5-1m">
            <div className="container">
                <div className="mbr-section-head">
                    <h3 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2"><strong>Frequently Asked Questions</strong></h3>
                    <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-7">Powered by Google Gemini GenAI assistant, you can ask questions about the application such as "What are the available vehicles" or "Who is the developer", "Payment methods accepted" etc. Please note this feature is experimental and for demo purposes for now</h4>
                </div>
                <div className="row justify-content-center mt-4">
                    <div className="col-lg-8 mx-auto mbr-form" data-form-type="formoid">
                        <form className="mbr-form form-with-styler"
                            data-form-title="Form Name" onSubmit={handleSubmit}>
                            <div className="dragArea row">
                                <div className="col-12 form-group mb-3" data-for="textarea">
                                    <textarea name="textarea" placeholder="Message" data-form-field="textarea" className="form-control" id="textarea-form5-1m" value={question} onChange={handleChange}></textarea>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 align-center mbr-section-btn"><button
                                    type="submit" className="btn btn-primary display-4">Ask a question</button></div>
                            </div>
                        </form>
                    </div>
                </div>
                {loading ? (
                    <div className="mt-4">
                        <SpinnerLoading />
                    </div>
                ) : answer && (
                    <div className="mt-4">
                        <h4>Answer:</h4>
                        <p>{answer}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AboutPage;