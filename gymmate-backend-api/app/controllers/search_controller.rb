class SearchController < ApplicationController

  def index
    if params[:query] && !params[:query].empty?
      trainers = Trainer.search(params[:query])
      users = User.search(params[:query])
      programs = Program.search(params[:query])

      render json: {
        trainers: ActiveModel::Serializer::CollectionSerializer.new(trainers, each_serializer: TrainerSerializer),
        users: ActiveModel::Serializer::CollectionSerializer.new(users, each_serializer: UserSerializer),
        programs: ActiveModel::Serializer::CollectionSerializer.new(programs, each_serializer: ProgramSerializer),
      }
    end
  end
end
