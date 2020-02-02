class ExerciseSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :sets, :repetitions, :program_id, :video
end
